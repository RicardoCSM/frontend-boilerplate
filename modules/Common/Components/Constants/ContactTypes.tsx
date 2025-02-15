import { LucideIcon, Mail, MessageCircle, Phone } from "lucide-react";

interface ContactType {
  label: string;
  value: string;
  mask: string;
  icon: LucideIcon;
}

const ContactTypes: ContactType[] = [
  {
    label: "Telefone",
    value: "phone",
    mask: "(99) 9999-9999",
    icon: Phone,
  },
  {
    label: "E-mail",
    value: "email",
    mask: "",
    icon: Mail,
  },
  {
    label: "WhatsApp",
    value: "whatsapp",
    mask: "(99) 9 9999-9999",
    icon: MessageCircle,
  },
];

export default ContactTypes;
