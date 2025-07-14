import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const VerificationFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is the $50 verification fee for?",
      answer: "The $50 verification fee is a one-time payment that grants you verified seller status on AppOrbit. This includes a verified badge, priority product approval, enhanced customer trust, and premium support access."
    },
    {
      question: "Is this a subscription or one-time payment?",
      answer: "This is a one-time payment of $50. There are no recurring charges or monthly fees. Once verified, you maintain your verified status permanently."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and debit cards. All payments are processed securely through Stripe."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We offer a 30-day money-back guarantee. If you're not satisfied with the verification benefits, contact our support team for a full refund."
    },
    {
      question: "How long does verification take?",
      answer: "Verification is instant! Once your payment is processed successfully, your account will be immediately upgraded to verified status."
    },
    {
      question: "What happens if I don't get verified?",
      answer: "You can still use AppOrbit as a free user. However, verified users get priority listing, faster approval times, and enhanced trust with customers."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-700 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-bold text-white">Frequently Asked Questions</h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full p-4 text-left bg-gray-800 hover:bg-gray-750 transition-colors flex items-center justify-between"
            >
              <span className="text-white font-medium">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {openIndex === index && (
              <div className="p-4 bg-gray-900 border-t border-gray-700">
                <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
        <p className="text-blue-300 text-sm text-center">
          💡 Still have questions? Contact our support team for personalized assistance.
        </p>
      </div>
    </div>
  );
};

export default VerificationFAQ; 