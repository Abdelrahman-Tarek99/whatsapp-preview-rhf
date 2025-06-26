import { ButtonType } from '../types/Whatsapp.types';

export const renderButton = (button: ButtonType, index: number) => {
  const getButtonStyle = () => {
    switch (button.buttonType) {
      case 'URL':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'CALL':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'OFFER_CODE':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const getButtonText = () => {
    switch (button.buttonType) {
      case 'URL':
        return button.url || 'Visit Website';
      case 'CALL':
        return button.phone || 'Call Now';
      case 'OFFER_CODE':
        return button.text || 'Use Code';
      default:
        return button.text || 'Button';
    }
  };

  return (
    <button
      key={index}
      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${getButtonStyle()}`}
      onClick={() => {
        // Handle button click based on type
        switch (button.buttonType) {
          case 'URL':
            if (button.url) window.open(button.url, '_blank');
            break;
          case 'CALL':
            if (button.phone) window.open(`tel:${button.phone}`, '_self');
            break;
          case 'OFFER_CODE':
            // Handle offer code copy or action
            if (button.text) navigator.clipboard.writeText(button.text);
            break;
        }
      }}
    >
      {getButtonText()}
    </button>
  );
}; 