export const doesVoterExist = async (payload: object) => {
  const res = await fetch(
    "https://titan.csit.rmit.edu.au/~s3851781/DBA/asg4/valid_voter.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();
  return {
    success: data.status === 200,
    message: data.message,
    electorateName: data.electorate_name,
  };
}

export const hasNotPreviouslyVoted = async (payload: object) => {
  const res = await fetch(
    "https://titan.csit.rmit.edu.au/~s3851781/DBA/asg4/previously_voted.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();
  return {
    success: data.status === 200,
    message: data.message,
  };
};

export const getCandidates = async (payload: object) => {
  const res = await fetch(
    "https://titan.csit.rmit.edu.au/~s3851781/DBA/asg4/get_candidates.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();
  return {
    success: data.status === 200,
    message: data.message,
    data: data.data
  };
}

export const castVotes = async (payload: any) => {
  const payloadCandidates = JSON.parse(JSON.stringify(payload.candidates));
  // Loop through candidates and ensure all preference fields are either parsed as non NaN integers or null
  for (const candidate of payloadCandidates) {
    const preference = candidate.preference;
    if (preference === "") {
      candidate.preference = 0;
    } else {
      const parsedPreference = parseInt(preference);
      if (isNaN(parsedPreference)) {
        candidate.preference = 0;
      } else {
        candidate.preference = parsedPreference;
      }
    }
  }
  
  const validPayload = {
    ...payload,
    candidates: payloadCandidates,
  };

  const res = await fetch(
    "https://titan.csit.rmit.edu.au/~s3851781/DBA/asg4/cast_votes.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validPayload),
    }
  );

  const data = await res.json();
  return {
    success: data.status === 200,
    message: data.message,
  };
};