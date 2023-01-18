import DropdownTextField from '../../components/Input/DropdownTextField';
import SimpleTextField from '../../components/Input/SimpleTextField';

export default function NewSeed() {
  const ButtonRow = () => (
    <div className="flex flex-row justify-between space-x-4">
      <button className="grow max-w-[240px] text-white border border-zinc-600 hover:bg-zinc-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center">
        Abbrechen
      </button>
      <button
        type="submit"
        className="grow max-w-[240px] text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
      >
        Eintragen
      </button>
    </div>
  );

  const SeedInsertionForm = () => (
    <>
      <form>
        <div className="grid gap-8 mb-6 md:grid-cols-2">
          <SimpleTextField
            labelText="Bezugsjahr"
            placeHolder="2023"
            required={true}
            forText="harvest_year"
          />
          {
            // Should not be simple Textfield for Kategorien
          }
          <SimpleTextField
            labelText="Kategorien"
            placeHolder="2023"
            required={true}
            forText="tags"
          />
          <SimpleTextField labelText="Art" placeHolder="Feldsalat" required={true} forText="name" />
          <SimpleTextField
            labelText="Sorte"
            placeHolder="Unbekannt"
            required={true}
            forText="variety"
          />
          <SimpleTextField
            labelText="Menge"
            placeHolder="Genug"
            required={true}
            forText="quantity"
          />
          <SimpleTextField labelText="Herkunft" placeHolder="Billa" forText="origin" />
          <SimpleTextField labelText="Verbrauch bis" placeHolder="2024" forText="use_by" />
          <SimpleTextField labelText="Qualität" placeHolder="Bio" forText="quality" />
          <SimpleTextField labelText="Geschmack" placeHolder="nussig" forText="taste" />
          <SimpleTextField labelText="Ertrag" placeHolder="1" forText="yield" />
          <SimpleTextField labelText="Preis" placeHolder="2,99€" forText="price" />
          <SimpleTextField labelText="Generation" placeHolder="0" forText="generation" />
        </div>
        <div className="mb-6">
          <SimpleTextField isArea={true} labelText="Notizen" placeHolder="..." forText="notes" />
        </div>
      </form>
      <ButtonRow />
    </>
  );

  return (
    <div className="w-full md:w-[700px] mx-auto p-4">
      <h2 className="mb-8">Neuer Eintrag</h2>
      <SeedInsertionForm />
    </div>
  );
}
