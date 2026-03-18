import { FadeInSection } from "./FadeInSection";

const partners = [
  { name: "World Bank",                    logo: "/logos/worldbank.svg" },
  { name: "UNICEF",                        logo: "/logos/unicef.svg" },
  { name: "Bill & Melinda Gates Foundation", logo: "/logos/gates.png" },
  { name: "USAID",                         logo: "/logos/usaid.png" },
  { name: "African Development Bank",      logo: "/logos/afdb.png" },
  { name: "Global Fund",                   logo: "/logos/globalfund.png" },
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
                className="flex items-center justify-center h-12 w-28 md:w-36 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
                title={partner.name}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  loading="lazy"
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
