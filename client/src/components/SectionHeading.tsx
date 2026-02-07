import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

export function SectionHeading({ title, subtitle, light = false }: SectionHeadingProps) {
  return (
    <div className="text-center mb-16 space-y-4">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`text-4xl md:text-5xl font-bold ${light ? 'text-white' : 'text-primary'}`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-[2px] w-48 mx-auto"
          style={{
            background: light
              ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.45) 0%, transparent 70%)',
          }}
        />
      )}
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`text-lg max-w-2xl mx-auto ${light ? 'text-white/90' : 'text-muted-foreground'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
