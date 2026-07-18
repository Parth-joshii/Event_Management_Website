export const legalPages = {
  "privacy-policy": {
    title: "Privacy Policy",
    updatedAt: "June 28, 2026",
    sections: [
      {
        heading: "Information We Collect",
        body: "We collect inquiry details such as name, phone, email, city, event date, event preferences, budget range, guest count, and special requirements when you submit a form."
      },
      {
        heading: "How We Use Information",
        body: "Information is used to respond to inquiries, prepare event suggestions, coordinate consultation calls, and improve our public website experience."
      },
      {
        heading: "Data Sharing",
        body: "We do not sell personal information. Inquiry details may be shared only with internal planning staff or trusted vendors when required for quotation preparation."
      }
    ]
  },
  "refund-policy": {
    title: "Refund & Cancellation Policy",
    updatedAt: "June 28, 2026",
    sections: [
      {
        heading: "Advance Blocking",
        body: "Event advances may be used to block dates, vendors, materials, artists, venues, or production teams. Refund eligibility depends on work completed and vendor commitments."
      },
      {
        heading: "Postponement",
        body: "Postponement requests are handled based on availability and vendor terms. Any additional cost is communicated transparently."
      },
      {
        heading: "Cancellation",
        body: "Cancellation deductions may apply for planning work, designs, vendor blocking, procurement, logistics, and other confirmed expenses."
      }
    ]
  },
  "terms-and-conditions": {
    title: "Terms & Conditions",
    updatedAt: "June 28, 2026",
    sections: [
      {
        heading: "Scope Of Work",
        body: "Final scope, inclusions, exclusions, dates, venue rules, vendor responsibilities, and payment terms are confirmed in the written quotation or agreement."
      },
      {
        heading: "Client Responsibilities",
        body: "Clients must provide accurate event details, approvals, venue permissions, guest estimates, and timely payments to ensure smooth execution."
      },
      {
        heading: "Changes",
        body: "Any change in guest count, venue, services, decor, or schedule may affect pricing and execution timelines."
      }
    ]
  }
} as const;
