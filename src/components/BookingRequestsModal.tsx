import React, { useState } from 'react';
import { BookingRequest } from '../types/dental';
import { INITIAL_BOOKING_REQUESTS } from '../data/mockDentalData';

interface BookingRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptRequest: (req: BookingRequest) => void;
}

export const BookingRequestsModal: React.FC<BookingRequestsModalProps> = ({
  isOpen,
  onClose,
  onAcceptRequest,
}) => {
  const [requests, setRequests] = useState<BookingRequest[]>(
    INITIAL_BOOKING_REQUESTS
  );

  if (!isOpen) return null;

  const handleAction = (id: string, action: 'Approved' | 'Declined') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface rounded-2xl shadow-2xl border border-border-card max-w-2xl w-full p-5 lg:p-6 flex flex-col gap-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-border-divider/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary-container text-primary flex items-center justify-center font-bold text-sm">
              {requests.filter((r) => r.status === 'Pending').length}
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Incoming Online & WhatsApp Requests
              </h2>
              <p className="text-xs text-text-secondary">
                Verify patient complaints and assign to Operatory 1 or 2
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-1">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                req.status === 'Approved'
                  ? 'bg-success-tint/60 border-emerald-300'
                  : req.status === 'Declined'
                  ? 'bg-danger-tint/60 border-rose-300 opacity-60'
                  : req.urgency === 'Emergency'
                  ? 'bg-danger-tint/30 border-rose-200'
                  : 'bg-surface-container-low border-border-divider/60'
              }`}
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-text-primary">
                    {req.patientName}
                  </span>
                  <span
                    className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                      req.urgency === 'Emergency'
                        ? 'bg-danger text-white'
                        : 'bg-surface-container text-text-secondary'
                    }`}
                  >
                    {req.urgency}
                  </span>
                  <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">
                      chat
                    </span>{' '}
                    {req.channel}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-snug">
                  "{req.reason}"
                </p>
                <div className="flex items-center gap-3 text-[11px] text-text-secondary pt-0.5">
                  <span className="font-mono text-primary font-semibold">
                    Requested: {req.requestedDate} • {req.requestedTime}
                  </span>
                  <span>•</span>
                  <span>{req.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {req.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleAction(req.id, 'Declined')}
                      className="px-3 py-1.5 rounded-lg bg-surface text-danger border border-danger/30 hover:bg-danger-tint text-xs font-semibold cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => {
                        handleAction(req.id, 'Approved');
                        onAcceptRequest(req);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-sm cursor-pointer"
                    >
                      Accept & Schedule
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface border">
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border-divider/50 text-xs">
          <span className="text-text-secondary">
            AI Triage: Automated priority triage active
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
