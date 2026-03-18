import { FadeInSection } from "./FadeInSection";

const partners = [
  { name: "World Bank", abbr: "WB" },
  { name: "UNICEF", abbr: "UNICEF" },
  { name: "Gates Foundation", abbr: "BMGF" },
  { name: "USAID", abbr: "USAID" },
  { name: "African Dev Bank", abbr: "AfDB" },
  { name: "The Global Fund", abbr: "GF" },
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
                className="flex flex-col items-center justify-center h-14 w-28 md:w-36 opacity-50 hover:opacity-100 transition-all cursor-default"
                title={partner.name}
              >
                <span className="text-base md:text-lg font-bold tracking-tight text-foreground">
                  {partner.abbr}
                </span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight mt-0.5">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
