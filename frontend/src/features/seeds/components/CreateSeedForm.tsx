import DropdownMenu from '@/components/Input/Dropdown/DropdownMenu';
import SimpleTextField from '@/components/Input/SimpleTextField';

interface CreateSeedFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const CreateSeedForm = ({ onCancel, onSubmit }: CreateSeedFormProps) => {
  return (
    <div>
      <form>
        <div className="mb-6 grid gap-8 md:grid-cols-2">
          <SimpleTextField
            labelText="Bezugsjahr"
            placeHolder="2023"
            required={true}
            forText="harvest_year"
          />
          <DropdownMenu
            placeHolder="Blattpflanze"
            forText="categories"
            required={true}
            multiple={true}
            labelText="Kategorie"
            options={['Blattpflanze', 'Fruchtpflanze']}
          />
          <SimpleTextField labelText="Art" placeHolder="Feldsalat" required={true} forText="name" />
          <DropdownMenu
            placeHolder="Unbekannt"
            forText="variety"
            labelText="Sorte"
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
          <DropdownMenu
            labelText="Qualität"
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
      <div className="flex flex-row justify-between space-x-4">
        <button
          onClick={onCancel}
          className="max-w-[240px] grow rounded-lg border border-zinc-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-600 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
        >
          Abbrechen
        </button>
        <button
          onClick={onSubmit}
          className="max-w-[240px] grow rounded-lg bg-gray-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
        >
          Eintragen
        </button>
      </div>
    </div>
  );
};

export default CreateSeedForm;
