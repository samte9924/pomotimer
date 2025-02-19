SELECT
	DATE(session_start_time) AS 'day',
    SUM(session_duration) AS total_duration,
    COUNT(session_id) AS total_sessions
FROM Sessions
GROUP BY DATE(session_start_time)
ORDER BY 'day';
