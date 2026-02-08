import { FadeInSection } from "./FadeInSection";

const partners = [
  { 
    name: "World Bank", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/The_World_Bank_logo.svg",
  },
  { 
    name: "UNICEF", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Logo_of_UNICEF.svg",
  },
  { 
    name: "Bill & Melinda Gates Foundation", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Bill_%26_Melinda_Gates_Foundation_logo.svg",
  },
  { 
    name: "USAID", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/79/USAID-Identity.svg",
  },
  { 
    name: "African Development Bank", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9f/African_Development_Bank_Logo.svg",
  },
  { 
    name: "Global Fund", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1f/The_Global_Fund_to_Fight_AIDS%2C_Tuberculosis_and_Malaria_logo.svg",
  },
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
