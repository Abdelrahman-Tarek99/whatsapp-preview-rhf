import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WhatsappMarketingUtilitySecondStep } from './components/WhatsappBuilderTemplate';
import { WhatsappFormValues } from './types/Whatsapp.types';

function App() {
  const {
    control,
    watch,
    setValue,
    formState,
    unregister,
    getValues,
  } = useForm<WhatsappFormValues>({
    defaultValues: {
      header: "",
      body: "",
      footer: "",
      headerVariables: [],
      bodyVariables: [],
      buttons: [],
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          WhatsApp Template Builder
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <WhatsappMarketingUtilitySecondStep
            control={control}
            watch={watch}
            setValue={setValue}
            formState={formState}
            unregister={unregister}
            getValues={getValues}
            templateType="Marketing"
            drawerMode="edit"
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
