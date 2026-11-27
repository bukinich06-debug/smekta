interface ICardHeaderSectionProps {
  title: string;
  children: React.ReactNode;
}

export const CardHeaderSection = ({ title, children }: ICardHeaderSectionProps) => (
  <section className="bg-white shadow rounded-lg p-5 h-full">
    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{title}</h2>
    {children}
  </section>
);

import { Tooltip } from '@/components/shared/tooltip';

interface ICardHeaderFieldProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
}

export const CardHeaderField = ({ label, children, hint }: ICardHeaderFieldProps) => (
  <div>
    <p className="text-sm text-gray-500">
      {hint ? (
        <Tooltip content={hint}>
          <span className="border-b border-dotted border-gray-400">{label}</span>
        </Tooltip>
      ) : (
        label
      )}
    </p>
    <div className="text-base font-semibold text-gray-900">{children}</div>
  </div>
);
