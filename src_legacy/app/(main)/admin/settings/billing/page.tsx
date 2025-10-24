import BillingForm from "../_components/billing-form";
import ContentSection from "../_components/content-section";

export default function SettingsProfile() {
  return (
    <ContentSection title="Billing" desc="Manage your payment methods, subscription plan, and billing information.">
      <BillingForm />
    </ContentSection>
  );
}
