import { PulseLoader } from "react-spinners";

function Loader({ ...props }: React.ComponentProps<"div">) {
  return <PulseLoader {...props} size={14} color="var(--ou-crimson)" />;
}

export default Loader;
