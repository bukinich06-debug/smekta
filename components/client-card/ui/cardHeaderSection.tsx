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

interface ICardHeaderFieldProps {
  label: string;
  children: React.ReactNode;
}

export const CardHeaderField = ({ label, children }: ICardHeaderFieldProps) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <div className="text-base font-semibold text-gray-900">{children}</div>
  </div>
);
