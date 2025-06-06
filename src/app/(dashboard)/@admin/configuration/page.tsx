import SettingsCard from "./(components)/SettingsCard";

export default function Configuration() {
  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      {/* Account Settings Section */}
      <h2 className='text-lg font-semibold text-gray-500 font-lato mb-4'>
        Account Settings
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <SettingsCard
          title='School Information'
          iconSrc='/school infro.svg'
          link='/configuration/school-information'
        />
        <SettingsCard
          title='System Settings'
          iconSrc='/system settings.svg'
          link='/configuration/system-settings'
        />
        <SettingsCard
          title='Classes'
          iconSrc='class.svg'
          link='/configuration/classes'
        />
        <SettingsCard
          title='Session and Term'
          iconSrc='sessoin and term.svg'
          link='/configuration/session-term'
        />
        <SettingsCard
          title='Subject'
          iconSrc='subject.svg'
          link='/configuration/subject'
        />
      </div>

      {/* Performance Configuration Section */}
      <h2 className='text-lg font-semibold text-gray-500 mb-4 font-lato'>
        Performance Configuration
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <SettingsCard
          title='Marking Scheme'
          iconSrc='Marking scheme.svg'
          link='/configuration/marking-scheme'
        />
        <SettingsCard
          title='Grading Scheme'
          iconSrc='grading.svg'
          link='/configuration/grading-scheme'
        />
        <SettingsCard
          title='Continuous Assessment Scheme'
          iconSrc='contoun.svg'
          link='/configuration/continuous-assessment'
        />
        <SettingsCard
          title='Report Sheet Settings'
          iconSrc='result.svg'
          link='/configuration/report-sheet-settings'
        />
      </div>
    </div>
  );
}
