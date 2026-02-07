import { FadeInSection } from "./FadeInSection";

const partners = [
  { name: "World Bank", logoPlaceholder: "WB" },
  { name: "UNICEF", logoPlaceholder: "UN" },
  { name: "Gates Foundation", logoPlaceholder: "GF" },
  { name: "USAID", logoPlaceholder: "US" },
  { name: "African Development Bank", logoPlaceholder: "ADB" },
  { name: "DFID", logoPlaceholder: "DF" },
];

export function Partners() {
  return (
    <section className="py-12 md:py-16 border-t bg-background">
      <div className="container">
        <FadeInSection>
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by leading research institutions and development organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center justify-center h-12 w-24 md:w-32 rounded bg-muted/50 text-muted-foreground font-semibold text-sm hover:bg-muted transition-colors"
                title={partner.name}
              >
                {partner.logoPlaceholder}
              </div>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
