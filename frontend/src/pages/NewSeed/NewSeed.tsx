import DropdownTextField from '../../components/Input/DropdownMenu';
import SimpleTextField from '../../components/Input/SimpleTextField';

export default function NewSeed() {
  const ButtonRow = () => (
    <div className="flex flex-row justify-between space-x-4">
      <button className="max-w-[240px] grow rounded-lg border border-zinc-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-600 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto">
        Abbrechen
      </button>
      <button
        type="submit"
        className="max-w-[240px] grow rounded-lg bg-gray-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
      >
        Eintragen
      </button>
    </div>
  );

  const SeedInsertionForm = () => (
    <>
      <form>
        <div className="mb-6 grid gap-8 md:grid-cols-2">
          <SimpleTextField
            labelText="Bezugsjahr"
            placeHolder="2023"
            required={true}
            forText="harvest_year"
          />
          <DropdownTextField
            placeHolder="Blattpflanze"
            forText="categories"
            required={true}
            options={['Blattpflanze', 'Fruchtpflanze']}
          />
          <SimpleTextField labelText="Art" placeHolder="Feldsalat" required={true} forText="name" />
          <DropdownTextField
            placeHolder="Unbekannt"
            forText="variety"
            options={['Unbekannt', 'Sorte1', 'Sorte2']}
          />
          <SimpleTextField
            labelText="Menge"
            placeHolder="Genug"
            required={true}
            forText="quantity"
          />
          <SimpleTextField labelText="Herkunft" placeHolder="Billa" forText="origin" />
          <SimpleTextField labelText="Verbrauch bis" placeHolder="2024" forText="use_by" />
          <DropdownTextField
            placeHolder="Blattpflanze"
            forText="quality"
            options={['Bio', 'Nicht-Bio']}
          />
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
    <div className="mx-auto w-full p-4 md:w-[700px]">
      <h2 className="mb-8">Neuer Eintrag</h2>
      <SeedInsertionForm />
    </div>
  );
}
