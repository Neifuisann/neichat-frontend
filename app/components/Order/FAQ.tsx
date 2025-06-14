import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
    PowerIcon,
    ShieldCheckIcon,
    Settings2Icon,
    FileTextIcon,
    WifiIcon,
    CreditCardIcon,
} from "lucide-react";

interface qnaProps {
    question: string;
    answer: string;
    icon: React.ReactNode;
}

const ICON_SIZE = 20;

const qna: qnaProps[] = [
    {
        question: "What happens after the 1-month free premium subscription?",
        answer: "After your 1-month free trial, you can choose to continue with the premium features for $10/month, or use our free tier with limited usage. We'll remind you before the trial ends, so you can decide what's best for you.",
        icon: <CreditCardIcon size={ICON_SIZE} />,
    },
    {
        question: "How do I set up my Aisha?",
        answer: "Setting up your Aisha is easy. Just press the main button on the device, find the Aisha-DEVICE wifi network, and register your device with your email. You'll be chatting with your favorite AI character in seconds.",
        icon: <PowerIcon size={ICON_SIZE} />,
    },
    {
        question: "Is my conversation data private and secure?",
        answer: "We take your privacy seriously. All conversations are stored securely on our servers. You have full control over your data and can retrieve or delete it at any time. Reach out to us if you have any questions.",
        icon: <ShieldCheckIcon size={ICON_SIZE} />,
    },
    {
        question: "Can I customize my Aisha AI's voice and personality?",
        answer: "Yes! You can choose from a variety of voices and personalities for your AI character. As you interact more, it will naturally adapt to your preferences and conversation style.",
        icon: <Settings2Icon size={ICON_SIZE} />,
    },
    {
        question: "Can I use Aisha AI with my documents?",
        answer: "We are currently working on a robust Retrieval Augmented Generation (RAG) feature. It will be available very soon!",
        icon: <FileTextIcon size={ICON_SIZE} />,
    },
    {
        question: "Can I use Aisha AI with any home wifi network?",
        answer: "Yes! Aisha AI will automatically connect to up to 5 private wifi networks or your phone hotspot. If you are having trouble connecting, please try restarting the device.",
        icon: <WifiIcon size={ICON_SIZE} />,
    },
];

const FAQ = ({
    className,
    titleClassName,
}: {
    className?: string;
    titleClassName?: string;
}) => {
    return (
        <div className={cn("mb-16 px-4 max-w-screen-sm w-full mx-auto", className)}>
            <h2 className={cn("text-4xl font-semibold mb-8 text-center", titleClassName)}>
                Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
                {qna.map((faq, index) => (
                    <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="w-full"
                    >
                        <AccordionTrigger className="flex items-center justify-between">
                            <div className="flex gap-6 text-left">
                                <div className="w-6 h-6 flex-shrink-0">
                                    {faq.icon}
                                </div>
                                <span>{faq.question}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="w-full">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default FAQ;
