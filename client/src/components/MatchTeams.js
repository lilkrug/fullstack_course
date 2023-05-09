import React from 'react';

function MatchTeams(props) {
  const { firstTeam, secondTeam, firstTeamGoals, secondTeamGoals } = props;
  console.log(firstTeam)
  return (
    <div>
      <h1>
      {firstTeam.name}
      </h1>
      {firstTeam.name}
      {/* <div className="team-block">
        <div className="team-logo">
          <img src={firstTeam.logoUrl} alt={firstTeam.name} />
        </div>
        <div className="team-name">{firstTeam.name}</div>
        <div className="team-goals">{firstTeamGoals}</div>
      </div>
      <div className="team-block">
        <div className="team-logo">
          <img src={secondTeam.logoUrl} alt={secondTeam.name} />
        </div>
        <div className="team-name">{secondTeam.name}</div>
        <div className="team-goals">{secondTeamGoals}</div>
      </div> */}
    </div>
  );
}

export default MatchTeams;