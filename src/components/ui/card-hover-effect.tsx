import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";

export const HoverEffect = ({
  items,
  className,
  onItemClick,
}: {
  items: {
    title: string;
    description: string;
    id: string;
    icon?: any;
  }[];
  className?: string;
  onItemClick?: (id: string) => void;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 py-10",
        className
      )}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={item?.id}
            className="relative group block p-2 h-full w-full cursor-pointer"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onItemClick?.(item.id)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-primary/20 block rounded-sm"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              {Icon && (
                <div className="w-12 h-12 bg-gray-50 rounded-sm flex items-center justify-center mb-6 text-dark group-hover:bg-primary transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
              )}
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-sm h-full w-full p-8 overflow-hidden bg-white border border-gray-200 group-hover:border-primary/50 relative z-20 transition-colors duration-300",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-dark font-display font-bold text-2xl tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-4 text-gray-600 tracking-wide leading-relaxed text-lg",
        className
      )}
    >
      {children}
    </p>
  );
};
