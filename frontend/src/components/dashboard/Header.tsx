type Props = {
  HeaderText: {
    title: string;
    description: string;
  };
  Action?: React.ReactNode;
};

function DashboardHeader({
  HeaderText: { title, description },
  Action,
}: Props) {
  return (
    <div className="flex justify-between items-center h-20 py-2">
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {title}
        </h3>
        <p className="leading-4 text-xs">{description}</p>
      </div>
      <div>{Action}</div>
    </div>
  );
}

export default DashboardHeader;
