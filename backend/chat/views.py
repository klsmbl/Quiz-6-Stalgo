import json
import os
from urllib import error, request as urllib_request

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
PROJECT_KEYWORDS = [
    "book",
    "booking",
    "service",
    "carpet",
    "sofa",
    "upholstery",
    "seller",
    "expert",
    "payment",
    "paypal",
    "order",
    "profile",
    "admin",
    "application",
    "duration",
]


def is_project_related(message):
    lowered = message.lower()
    return any(keyword in lowered for keyword in PROJECT_KEYWORDS)


def call_gemini(message):
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return None, "Gemini API key is not configured on the server."

    prompt = (
        "You are an assistant for a Carpet and Upholstery Cleaning Services Marketplace. "
        "Only answer questions related to this platform: booking services, applying as a cleaning expert, "
        "payment through PayPal, service durations, orders, profile, seller dashboard, and admin actions. "
        "If the question is outside this scope, reply with: "
        "'I can only answer questions related to this marketplace project.'\n\n"
        f"User question: {message}"
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 220,
        },
    }

    http_request = urllib_request.Request(
        url=f"{GEMINI_API_URL}?key={api_key}",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib_request.urlopen(http_request, timeout=15) as api_response:
            body = json.loads(api_response.read().decode("utf-8"))
    except error.HTTPError as exc:
        return None, f"Gemini request failed with HTTP {exc.code}."
    except error.URLError:
        return None, "Gemini request failed due to network error."
    except json.JSONDecodeError:
        return None, "Gemini returned an invalid response format."

    candidates = body.get("candidates") or []
    if not candidates:
        return None, "Gemini returned no answer candidates."

    parts = candidates[0].get("content", {}).get("parts", [])
    text_parts = [part.get("text", "") for part in parts if part.get("text")]
    answer = "\n".join(text_parts).strip()

    if not answer:
        return None, "Gemini returned an empty answer."

    return answer, None


class AIChatbotView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        message = (request.data.get("message") or "").strip()

        if not message:
            return Response(
                {"detail": "message is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not is_project_related(message):
            return Response(
                {
                    "response": "I can only answer questions related to this marketplace project."
                }
            )

        gemini_answer, gemini_error = call_gemini(message)
        if gemini_answer:
            return Response({"response": gemini_answer, "provider": "gemini"})

        replies = [
            (
                ["book", "booking", "carpet cleaning"],
                "Browse services, open a service detail page, then complete PayPal checkout to book.",
            ),
            (
                ["apply", "seller", "cleaning expert"],
                "Go to seller application, submit details, then wait for admin approval.",
            ),
            (
                ["payment", "paypal"],
                "Payments go to the seller PayPal account. The platform tracks the transaction.",
            ),
            (
                ["sofa", "duration", "how long"],
                "Most sofa cleaning services are around 1 hour, depending on furniture size and condition.",
            ),
        ]

        for keywords, response_text in replies:
            if any(keyword in message.lower() for keyword in keywords):
                fallback_payload = {"response": response_text, "provider": "fallback"}
                if gemini_error:
                    fallback_payload["note"] = gemini_error
                return Response(fallback_payload)

        fallback_payload = {
            "response": "I can only answer marketplace questions about booking, seller applications, payments, services, and orders.",
            "provider": "fallback",
        }
        if gemini_error:
            fallback_payload["note"] = gemini_error

        return Response(fallback_payload)
