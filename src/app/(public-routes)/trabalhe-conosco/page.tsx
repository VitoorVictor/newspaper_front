import ContactForm, { WorkWithUsAnimation } from "@/components/forms";

export default async function TrabalheConoscoPage() {
  return (
    <div className="container mx-auto my-4 md:my-8 p-4 space-y-4 md:space-y-6">
      <ContactForm>
        <WorkWithUsAnimation />
      </ContactForm>
    </div>
  );
}
