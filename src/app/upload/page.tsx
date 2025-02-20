import { SessionUploadForm } from "../components/SessionUploadForm";

export const metadata = {
  title: "Pomotimer | Carica sessioni",
};

export default async function UploadPage() {
  return (
    <div>
      <h1>Carica sessioni</h1>
      <SessionUploadForm />
    </div>
  );
}
