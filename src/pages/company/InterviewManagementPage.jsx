import React, { useState, useEffect } from 'react';
import { Calendar, Video, Clock, User, CheckCircle2, ExternalLink } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { applicationAPI } from '../../services/api';

export const InterviewManagementPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    setIsLoading(true);
    try {
      const res = await applicationAPI.getInterviews();
      if (res.success && res.interviews) {
        setInterviews(res.interviews);
      }
    } catch (err) {
      console.warn('Error loading interviews:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      <div className="border-b border-brand-border pb-6">
        <Badge variant="primary" size="sm" className="mb-2">
          Interview Coordination
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Interview Schedule</h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Review upcoming candidate video evaluations, direct meeting links, and interviewer preparation notes.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-brand-border animate-pulse" />
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled yet"
          description="Go to the Applicants page and click 'Schedule Interview' on any candidate."
        />
      ) : (
        <div className="space-y-4">
          {interviews.map((intv) => {
            const userObj = intv.candidateId?.userId || {};
            const job = intv.jobId || {};
            const candidateName = userObj.fullName || 'Candidate';
            const candidateImage = userObj.profileImage;

            return (
              <div
                key={intv._id}
                className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle hover:shadow-card transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary-light flex items-center justify-center font-bold text-brand-primary overflow-hidden flex-shrink-0">
                    {candidateImage ? (
                      <img src={candidateImage} alt={candidateName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-brand-navy">{candidateName}</h3>
                      <Badge variant="primary" size="sm">
                        {intv.status || 'scheduled'}
                      </Badge>
                    </div>
                    <div className="text-xs font-semibold text-brand-primary">{job.title || 'Job Opening'}</div>
                    <div className="text-xs text-brand-muted font-medium">{intv.roundName}</div>
                    {intv.notes && <p className="text-xs text-brand-muted/80 pt-1 italic">"{intv.notes}"</p>}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-brand-border/60">
                  <div className="text-left sm:text-right space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-navy">
                      <Clock className="w-3.5 h-3.5 text-brand-primary" />
                      {new Date(intv.scheduledAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="text-[11px] text-brand-muted">Virtual Meeting</div>
                  </div>

                  {intv.meetingLink && (
                    <a href={intv.meetingLink} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                      <Button variant="primary" size="sm" icon={Video} className="w-full sm:w-auto">
                        Join Meeting
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
