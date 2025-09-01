import ContactForm, { AdvertiseAnimation } from "@/components/forms";

export default async function AnunciePage() {
  return (
    <div className="container mx-auto my-4 md:my-8 p-4 space-y-4 md:space-y-6">
      <ContactForm>
        <AdvertiseAnimation />
      </ContactForm>
    </div>
  );
}
