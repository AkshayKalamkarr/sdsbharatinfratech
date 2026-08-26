import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "919076326232";
  const message = "Hello, I am interested in your project";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition duration-300"
    >
      <MessageCircle size={28} />
    </a>
  );
};

export default WhatsAppButton;
