import ContactForm, { AdvertiseAnimation } from "@/components/forms";

export default async function AnunciePage() {
  return (
    <div className="container grid items-center h-full mx-auto my-2 p-2 space-y-2 md:space-y-4">
      <ContactForm>
        <AdvertiseAnimation />
      </ContactForm>
    </div>
  );
}
