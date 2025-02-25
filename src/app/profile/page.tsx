import { ExportCSVButton } from "../components/ExportCSVButton";

export default function ProfilePage() {
  return (
    <div>
      <h1>Profilo</h1>
      <p>Qui puoi modificare il tuo profilo.</p>
      <h2>Esporta sessioni</h2>
      <ExportCSVButton />
    </div>
  );
}
