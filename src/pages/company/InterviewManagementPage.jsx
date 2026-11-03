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

  const mockDefaultInterviews = [
    {
      _id: 'intv_01',
      roundName: 'Technical Round 1: React Architecture & Live Coding',
      candidateId: {
        userId: {
          fullName: 'Ayush Sharma',
          email: 'candidate@campusplus.com',
          profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
      },
      jobId: {
        title: 'Senior Frontend Engineer (React & TypeScript)',
      },
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      meetingLink: 'https://meet.google.com/cmp-nexus-intv',
      notes: 'Prepare to evaluate custom hooks, Redux Toolkit, and accessibility standards.',
      status: 'scheduled',
    },
  ];

  const list = interviews.length > 0 ? interviews : mockDefaultInterviews;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-brand-border pb-6">
        <Badge variant="primary" size="sm" className="mb-2">
          Interview Coordination
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Interview Schedule</h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Review upcoming candidate video evaluations, direct meeting links, and interviewer preparation notes.
        </p>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled yet"
          description="Go to the Applicants page and click 'Schedule Interview' on any shortlisted candidate."
        />
      ) : (
        <div className="space-y-4">
          {list.map((intv) => {
            const userObj = intv.candidateId?.userId || {};
            const job = intv.jobId || {};

            return (
              <div
                key={intv._id}
                className="bg-white rounded-3xl border border-brand-border p-6 sm:p-7 shadow-subtle hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-brand-primary-light flex items-center justify-center font-bold text-sm text-brand-navy flex-shrink-0">
                      {userObj.profileImage ? (
                        <img src={userObj.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        userObj.fullName?.charAt(0) || 'C'
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-brand-navy">{intv.roundName}</h3>
                      <div className="text-xs text-brand-muted mt-0.5">
                        Candidate: <span className="font-bold text-brand-navy">{userObj.fullName || 'Ayush Sharma'}</span> • {job.title || 'Frontend Engineer'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted">
                    <span className="flex items-center gap-1 font-semibold text-brand-navy">
                      <Clock className="w-3.5 h-3.5 text-brand-primary" />{' '}
                      {new Date(intv.scheduledAt).toLocaleString()}
                    </span>
                    <span>•</span>
                    <Badge variant="primary" size="sm">
                      Google Meet Video
                    </Badge>
                  </div>

                  {intv.notes && (
                    <p className="text-xs text-brand-muted bg-brand-bg/60 p-2.5 rounded-xl border border-brand-border/60">
                      <span className="font-bold text-brand-navy">Interviewer Notes: </span>
                      {intv.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto">
                  <a href={intv.meetingLink} target="_blank" rel="noreferrer">
                    <Button variant="primary" size="md" icon={Video}>
                      Join Video Call
                    </Button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
