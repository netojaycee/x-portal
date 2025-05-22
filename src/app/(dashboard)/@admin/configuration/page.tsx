import SettingsCard from "./(components)/SettingsCard";

export default function Configuration() {
  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      {/* Account Settings Section */}
      <h2 className='text-lg font-semibold text-gray-700 mb-4'>
        Account Settings
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <SettingsCard
          title='School Information'
          iconSrc='https://via.placeholder.com/40?text=School'
          link='/configuration/school-information'
        />
        <SettingsCard
          title='System Settings'
          iconSrc='https://via.placeholder.com/40?text=Settings'
          link='/configuration/system-settings'
        />
        <SettingsCard
          title='Classes'
          iconSrc='https://via.placeholder.com/40?text=Classes'
          link='/configuration/classes'
        />
        <SettingsCard
          title='Session and Term'
          iconSrc='https://via.placeholder.com/40?text=Session'
          link='/configuration/session-term'
        />
        <SettingsCard
          title='Subject'
          iconSrc='https://via.placeholder.com/40?text=Subject'
          link='/configuration/subject'
        />
      </div>

      {/* Performance Configuration Section */}
      <h2 className='text-lg font-semibold text-gray-700 mb-4'>
        Performance Configuration
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <SettingsCard
          title='Marking Scheme'
          iconSrc='https://via.placeholder.com/40?text=Marking'
          link='/configuration/marking-scheme'
        />
        <SettingsCard
          title='Grading Scheme'
          iconSrc='https://via.placeholder.com/40?text=Grading'
          link='/configuration/grading-scheme'
        />
        <SettingsCard
          title='Continuous Assessment Scheme'
          iconSrc='https://via.placeholder.com/40?text=Assessment'
          link='/configuration/continuous-assessment'
        />
        <SettingsCard
          title='Report Sheet Settings'
          iconSrc='https://via.placeholder.com/40?text=Report'
          link='/configuration/report-sheet-settings'
        />
      </div>
    </div>
  );
}
