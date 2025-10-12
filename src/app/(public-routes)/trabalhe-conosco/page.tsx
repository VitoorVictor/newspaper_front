import ContactForm, { WorkWithUsAnimation } from "@/components/forms";

export default async function TrabalheConoscoPage() {
  return (
    <div className="container grid items-center h-full mx-auto my-2 p-2 space-y-2 md:space-y-4">
      <ContactForm>
        <WorkWithUsAnimation />
      </ContactForm>
    </div>
  );
}
