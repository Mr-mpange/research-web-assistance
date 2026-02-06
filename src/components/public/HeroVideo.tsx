import heroVideo from "@/assets/hero-video.mp4";

export function HeroVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&q=80"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-primary/75" />
    </div>
  );
}
