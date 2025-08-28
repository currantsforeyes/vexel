      {/* Experience Grids */}
      <ExperienceGrid title="Recommended For You" experiences={experiences} onExperienceClick={onExperienceClick} />
      <ExperienceGrid title="Popular Experiences" experiences={[...experiences].reverse()} onExperienceClick={onExperienceClick} showFilters={true} />
      <ExperienceGrid title="New & Noteworthy" experiences={experiences.slice(2, 14)} onExperienceClick={onExperienceClick} />