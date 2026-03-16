import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

const botReplies = [
  {
    pattern: /book|booking|reserve/i,
    response:
      "To book a service, open the service detail page and click Book Service. Payments are sent directly to the seller's PayPal account.",
  },
  {
    pattern: /apply|expert|seller/i,
    response:
      "Use the Apply as Expert page in the header. Submit your details, then wait for Admin approval before your account is upgraded to Seller.",
  },
  {
    pattern: /payment|paypal|pay/i,
    response:
      "Payment is processed using PayPal multi-merchant flow. The order uses the service name as the PayPal order description and the listed service price.",
  },
  {
    pattern: /how long|duration|sofa cleaning/i,
    response:
      "Sofa cleaning typically takes around 1 hour, but exact duration depends on service type and furniture condition.",
  },
];

const fallbackResponse =
  "I can only answer platform-related questions about booking services, seller applications, payments, durations, profiles, and orders.";

function getReply(userText) {
  const matchedReply = botReplies.find((entry) => entry.pattern.test(userText));
  return matchedReply ? matchedReply.response : fallbackResponse;
}

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi, I can help with booking, seller applications, payment, and service questions.",
    },
  ]);

  function handleSubmit(event) {
    event.preventDefault();

    const message = input.trim();
    if (!message) {
      return;
    }

    const nextMessages = [
      ...messages,
      { from: "user", text: message },
      { from: "bot", text: getReply(message) },
    ];

    setMessages(nextMessages);
    setInput("");
  }

  return (
    <div className="chatbot-root">
      {isOpen ? (
        <Card className="chatbot-card shadow-lg border-0">
          <Card.Body className="p-3 d-flex flex-column">
            <div className="chatbot-header mb-2">
              <div>
                <strong>Support Assistant</strong>
                <div className="text-muted small">Ask booking and service questions</div>
              </div>
              <Button size="sm" variant="outline-dark" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
            <div className="chatbot-messages mb-3">
              {messages.map((message, index) => (
                <div key={`chat-${index}`} className={`chat-message ${message.from === "user" ? "chat-user" : "chat-bot"}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Control
                type="text"
                placeholder="Ask about booking, payment, or sellers"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </Form>
          </Card.Body>
        </Card>
      ) : null}

      <Button className="chatbot-toggle" variant="primary" onClick={() => setIsOpen((current) => !current)}>
        {isOpen ? "Hide Assistant" : "Need Help?"}
      </Button>
    </div>
  );
}

export default ChatbotWidget;
