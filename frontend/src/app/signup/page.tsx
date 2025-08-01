import SignUpForm from "@/components/SignUp/SignUpForm";

function page() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10 py-24">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}

export default page;
