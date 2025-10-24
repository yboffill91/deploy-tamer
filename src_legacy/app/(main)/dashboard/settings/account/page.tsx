import ProfileForm from '@/components/account/profile-form';

import ContentSection from '../_components/content-section';

export default function SettingsProfile() {
  return (
    <ContentSection title="Profile" desc="This is how others will see you on the site.">
      <ProfileForm />
    </ContentSection>
  );
}
