import useAgents from "@/hooks/admin/use-agents";
import { AdminPanelComponentProps } from "@/lib/types/admin";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import AgentsDisplay, { AdminAgent } from "../agents/AgentsDisplay";
import createEntityStore from "@/lib/stores/entityStore";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import { getAcronym } from "@/lib/utils";
import Modal from "../common-components/Modal";
import AgentEditorForm from "../agents/AgentEditorForm";
import { useCampuses } from "@/hooks/use-reference-data";

interface ModalState {
  mode: "add" | "edit";
  isOpen: boolean;
  // selectedAgent should be optional when not in 'edit' mode,
  selectedAgent: AdminAgent | null;
}

// 1. Refined Initial State: Provide complete, safe defaults
const initialModalState: ModalState = {
  isOpen: false,
  mode: "add",
  selectedAgent: null, // Initial agent should be null
};

interface AgentFormData {
  full_name: string;
  campus: string;
  phone_number: string;
  agent_fee: string;
}

const initialAgentFormData: AgentFormData = {
  full_name: "",
  campus: "",
  phone_number: "",
  agent_fee: "",
};

// Use the complete initial state in the store creator
const useModalState = createEntityStore<ModalState>(initialModalState);
const useAgentFormData = createEntityStore<AgentFormData>(initialAgentFormData);

function AgentManagement({
  serverData: { accessToken, user },
}: AdminPanelComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: campuses } = useCampuses();
  const { createAgent, isCreatingAgent, updateAgent, isUpdatingAgent } =
    useAgents(accessToken);
  const { agents, agentsIsLoading, agentsIsError } = useAgents(accessToken);

  // Use a more descriptive name like modalState for entities
  const { entities: modalState, setEntities: setModalState } = useModalState();
  const { entities: formData, setEntities: setFormData } = useAgentFormData();
  const { isOpen, mode, selectedAgent } = modalState;

  // Check permissions
  const hasAddAgentPermission = user?.employee_profile?.role?.permissions?.some(
    (permission) => permission.codename === "add_agent"
  ) ?? false;

  const hasChangeAgentPermission = user?.employee_profile?.role?.permissions?.some(
    (permission) => permission.codename === "change_agent"
  ) ?? false;

  // 2. Dedicated Setter Functions (better type safety and readability)

  /** Closes the modal and resets the state to the initial default */
  function onModalClose() {
    setModalState(initialModalState); // Resets everything safely
  }

  /** Opens the modal in 'add' mode */
  function onAddAgentClick() {
    setModalState({
      isOpen: true,
      mode: "add",
      selectedAgent: null,
    });
    setFormData(initialAgentFormData);
  }

  /** Opens the modal in 'edit' mode for a specific agent */
  function onEditAgentClick(agent: AdminAgent) {
    setModalState({
      isOpen: true,
      mode: "edit",
      selectedAgent: agent,
    });
    setFormData({
      full_name: agent.full_name,
      agent_fee: agent.agent_fee,
      phone_number: agent.phone_number,
      campus: agent.campus_id,
    });
  }

  // --- Filter Logic ---
  // 1. OPTIMIZATION: Normalize the query ONCE outside the loop.
  // We also default to "" to prevent crashing if searchQuery is null/undefined.
  const lowerQuery = searchQuery?.toLowerCase() || "";

  const filteredAgents = agents?.filter((agent: AdminAgent) => {
    // 2. SAFETY: Fail fast if the agent object itself is null/undefined
    if (!agent) return false;

    // 3. READABILITY & SAFETY:
    // Coalesce (??) null values to empty strings "" so .includes() always runs on a valid string.
    // This avoids "undefined" floating around in your boolean logic.
    const name = agent.full_name?.toLowerCase() ?? "";
    const campus = agent.campus_name?.toLowerCase() ?? "";

    // Note: We keep your getAcronym logic, assuming it returns a string.
    // If getAcronym can return null, add ?? "" there too.
    const acronym = getAcronym(agent.campus_name || "").toLowerCase();

    // 4. LOGIC: Return the boolean result directly.
    return (
      name.includes(lowerQuery) ||
      campus.includes(lowerQuery) ||
      acronym.includes(lowerQuery)
    );
  });
  // --- End Filter Logic ---

  function updateFormField(key: keyof AgentFormData, value: any) {
    setFormData({
      ...formData,
      [key]: value,
    });
  }

  async function handleSave() {
    if (mode === "add") await createAgent(formData);
    if (mode === "edit") await updateAgent({ formData, id: selectedAgent?.id });
    onModalClose();
  }

  if (agentsIsLoading) return <LoadingScreen />;
  if (agentsIsError) return <ErrorPage type="500" />;

  return (
    <>
      <div className="space-y-6 animate-fade-in pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Agent Roster
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Manage field agents and regional assignments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lapis transition-colors" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-10 bg-muted/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lapis/50 w-full md:w-64 transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={onAddAgentClick}
              disabled={!hasAddAgentPermission}
              className="bg-lapis cursor-pointer hover:bg-lapis/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-lapis/20 transition-all flex items-center gap-2 w-full md:w-auto justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" /> Add New Agent
            </button>
          </div>
        </div>
        <AgentsDisplay
          data={filteredAgents}
          handleEditClick={onEditAgentClick}
          searchQuery={searchQuery}
          hasChangeAgentPermission={hasChangeAgentPermission}
        />
      </div>
      <Modal
        isOpen={isOpen}
        title={mode === "add" ? "Create A New Agent" : "Edit Agent"}
        onClose={onModalClose} // Use the dedicated closer
        footer={
          <>
            <button
              onClick={onModalClose}
              className="px-5 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-lapis dark:bg-sky-600 text-white font-bold hover:bg-lapis-hover dark:hover:bg-sky-500 transition-colors shadow-sm text-sm cursor-pointer"
            >
              {isCreatingAgent || isUpdatingAgent
                ? "Saving..."
                : "Save Changes"}
            </button>
          </>
        }
      >
        <AgentEditorForm
          formData={formData}
          updateField={updateFormField}
          campuses={campuses || []}
        />
      </Modal>
    </>
  );
}

export default AgentManagement;
