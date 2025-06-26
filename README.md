# WhatsApp Dynamic RHF Template Builder

A modern, interactive WhatsApp template builder built with React and React Hook Form. This application allows users to create dynamic WhatsApp message templates with variables, buttons, and real-time preview.

## 🚀 Features

### ✨ Core Functionality
- **Dynamic Template Creation**: Build WhatsApp message templates with header, body, and footer sections
- **Variable Management**: Add and manage dynamic variables with placeholder syntax `{{1}}`, `{{2}}`, etc.
- **Button Integration**: Add interactive buttons (URL, Call, Offer Code) to your templates
- **Real-time Preview**: See your template exactly as it will appear in WhatsApp
- **Form Validation**: Comprehensive validation for all template components
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🎨 UI/UX Features
- **Modern Interface**: Clean, intuitive design with Tailwind CSS
- **Phone Frame Preview**: Realistic WhatsApp message preview in a phone mockup
- **Drag & Drop Style**: Easy variable management with add/remove functionality
- **Error Handling**: Clear error messages and validation feedback
- **Accessibility**: Fully accessible with proper ARIA labels and keyboard navigation

### 🔧 Technical Features
- **TypeScript**: Fully typed for better development experience
- **React Hook Form**: Efficient form management with validation
- **Internationalization**: Multi-language support with react-i18next
- **Custom Components**: No external UI library dependencies
- **Modular Architecture**: Clean, maintainable code structure

## 📦 Libraries & Dependencies

### Core Dependencies
- **React 19.0.0** - Modern React with latest features
- **React DOM 19.0.0** - React rendering for web
- **React Hook Form 7.56.1** - Performant forms with easy validation

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **PostCSS 8.5.3** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixing

### Icons & Assets
- **@tabler/icons-react** - Beautiful, customizable icons
- **Custom SVG Components** - Tailored icons for specific use cases

### Internationalization
- **react-i18next** - React internationalization framework
- **i18next** - JavaScript internationalization framework

### Development Tools
- **TypeScript 5.7.2** - Static type checking
- **Vite 6.3.1** - Fast build tool and dev server
- **ESLint 9.22.0** - Code linting and formatting
- **@hookform/devtools 4.4.0** - React Hook Form development tools

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whatsapp-dynamic-rhf
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🎯 How to Use

### Creating a Template

1. **Header Section**
   - Enter your message header (max 60 characters)
   - Add variables using the "Add Header Variables" button
   - Variables will appear as `{{1}}`, `{{2}}`, etc.

2. **Body Section**
   - Enter your message body (max 1024 characters)
   - Add variables using the "Add Body Variables" button
   - Use textarea for multi-line content

3. **Footer Section**
   - Enter your message footer (max 60 characters)
   - Optional but recommended for branding

4. **Adding Buttons**
   - Click "Add Button" to add interactive buttons
   - Choose button type: URL, Call, or Offer Code
   - Configure button text and target (URL/phone number)

5. **Variable Management**
   - Variables are automatically synchronized with placeholders
   - Remove variables to clean up unused placeholders
   - All changes are reflected in real-time preview

### Template Types

- **Marketing Templates**: Support URL, Call, and Offer Code buttons
- **Utility Templates**: Support URL and Call buttons only

## 🏗️ Project Structure

```
src/
├── components/
│   ├── WhatsappBuilderTemplate.tsx    # Main builder component
│   ├── useMarketing.tsx               # Custom hook for template logic
│   ├── WhatsappFormConstants.ts       # Form constants and options
│   └── PreviewSection.tsx             # WhatsApp preview component
├── types/
│   └── Whatsapp.types.ts              # TypeScript type definitions
├── constants/
│   └── validationRules.ts             # Form validation rules
├── hooks/
│   └── useErrorToast.ts               # Error handling hook
├── utils/
│   └── buttonRenderer.tsx             # Button rendering utility
├── assets/
│   └── whatsappBG.png                 # WhatsApp background image
├── i18n.ts                           # Internationalization setup
├── App.tsx                           # Main application component
├── main.tsx                          # Application entry point
└── index.css                         # Global styles
```

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Component styles in individual component files
- Global styles in `src/index.css`

### Internationalization
Add new languages by:
1. Adding translations to `src/i18n.ts`
2. Updating the language selector
3. Testing with different locales

### Component Customization
All components are custom-built with HTML and Tailwind CSS:
- No external UI library dependencies
- Easy to modify and extend
- Full control over styling and behavior

## 🔧 Development

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- React Hook Form for form management

### Best Practices
- Component-based architecture
- Custom hooks for reusable logic
- TypeScript interfaces for type safety
- Responsive design principles
- Accessibility standards

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React Hook Form for excellent form management
- Tailwind CSS for the utility-first styling approach
- Tabler Icons for beautiful iconography
- WhatsApp for the messaging platform inspiration
