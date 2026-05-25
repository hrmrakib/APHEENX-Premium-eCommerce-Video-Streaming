import Link from "next/link";

interface SectionHeaderProps {
  title?: string;
  href?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  href,
  className,
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className='flex items-center gap-3'>
        <div className='h-6 w-1 rounded-full bg-gold' />
        <h2 className='text-lg font-bold text-gold italic'>{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className='text-sm text-muted hover:text-gold transition-colors'
        >
          View All →
        </Link>
      )}
    </div>
  );
}
