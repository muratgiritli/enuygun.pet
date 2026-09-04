const SIZPA_URL = "https://www.sizpa.com/";

export default function SiteCredit({
  className = "text-[10px] text-muted-foreground/60",
  linkClassName = "underline hover:text-primary transition-colors",
}: {
  className?: string;
  linkClassName?: string;
}) {
  return (
    <p className={className} data-testid="text-site-credit">
      Bu site{" "}
      <a href={SIZPA_URL} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        Sizpa İnternet Tic. Ltd. Şti.
      </a>{" "}
      tarafından yapılmıştır.
    </p>
  );
}
