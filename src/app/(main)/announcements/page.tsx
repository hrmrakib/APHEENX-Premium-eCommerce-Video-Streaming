"use client";

import {
  useDeleteAnnouncementMutation,
  useGetAnnouncementsQuery,
  usePostAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "@/redux/features/announcement/announcementAPI";
import { useState } from "react";

/* ─── Types ─── */
interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface Meta {
  count: number;
  page: number;
  page_size: number;
  next: null | number;
  previous: null | number;
  total_pages: number;
}

type ModalType = "create" | "edit" | "view" | "delete" | null;

/* ─── Helpers ─── */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

/* ─── Global styles: fonts, keyframes, pseudo-elements ─── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');

  .font-cormorant { font-family: 'Cormorant Garamond', serif; }
  .font-dm        { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeIn  { from { opacity: 0 }                            to { opacity: 1 } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  @keyframes shimmer { 0% { background-position: 200% 0 }             100% { background-position: -200% 0 } }

  .animate-fadeIn  { animation: fadeIn  0.18s ease both; }
  .animate-slideUp { animation: slideUp 0.22s ease both; }

  .skeleton {
    background: linear-gradient(90deg, #1a1916 25%, #201f1c 50%, #1a1916 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
  }

  .btn-gold-bg {
    background: linear-gradient(135deg, #C9A84C 0%, #E4C87A 50%, #C9A84C 100%);
  }

  .ann-card { position: relative; overflow: hidden; }
  .ann-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, #C9A84C, transparent);
    border-radius: 3px 0 0 3px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .ann-card:hover::before { opacity: 1; }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

/* ─── Icons ─── */

const CloseIcon = () => (
  <svg
    width='14'
    height='14'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M6 18 18 6M6 6l12 12'
    />
  </svg>
);
const CalIcon = () => (
  <svg
    width='11'
    height='11'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5'
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    width='15'
    height='15'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
    />
  </svg>
);
const WarnIcon = () => (
  <svg
    width='18'
    height='18'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    viewBox='0 0 24 24'
    className='text-red-400 fx-shrink-0 mt-0.5'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
    />
  </svg>
);
const ChevronLeft = () => (
  <svg
    width='14'
    height='14'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M15.75 19.5 8.25 12l7.5-7.5'
    />
  </svg>
);
const ChevronRight = () => (
  <svg
    width='14'
    height='14'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='m8.25 4.5 7.5 7.5-7.5 7.5'
    />
  </svg>
);
const EmptyIcon = () => (
  <svg
    width='52'
    height='52'
    fill='none'
    stroke='currentColor'
    strokeWidth='1'
    viewBox='0 0 24 24'
    className='text-[rgba(201,168,76,0.3)]'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 1 8.835-2.535m0 0A23.74 23.74 0 0 1 18.795 3m.38 14.5a23.74 23.74 0 0 1-.38-14.5m.38 14.5a23.848 23.848 0 0 0 2.95 1.5'
    />
  </svg>
);

/* ─── Sub-components ─── */

interface BtnGoldProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
function BtnGold({ children, onClick, disabled, style = {} }: BtnGoldProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      className='font-dm inline-flex items-center gap-1.5 px-[1.2rem] py-[0.6rem] btn-gold-bg text-[#0d0c0a] text-[0.8rem] font-medium tracking-[0.06em] uppercase border-none rounded-lg cursor-pointer transition-opacity duration-200 hover:opacity-[0.88] hover:-translate-y-px active:scale-[0.97] disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none'
    >
      {children}
    </button>
  );
}

interface BtnGhostProps {
  children: React.ReactNode;
  onClick?: () => void;
}
function BtnGhost({ children, onClick }: BtnGhostProps) {
  return (
    <button
      onClick={onClick}
      className='font-dm bg-transparent border border-[rgba(201,168,76,0.15)] rounded-lg px-4 py-[0.55rem] text-[#8a8070] text-[0.78rem] tracking-[0.04em] cursor-pointer transition-all duration-200 hover:border-[rgba(201,168,76,0.3)] hover:text-[#f0ead8]'
    >
      {children}
    </button>
  );
}

interface BtnIconEditProps {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}
function BtnIconEdit({ onClick, children }: BtnIconEditProps) {
  return (
    <button
      onClick={onClick}
      className='inline-flex items-center justify-center w-8.5 h-8.5 bg-transparent rounded-lg cursor-pointer transition-all duration-200 shrink-0 text-[#C9A84C] border border-[rgba(201,168,76,0.15)] hover:bg-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.3)]'
    >
      {children}
    </button>
  );
}

interface BtnIconDelProps {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}
function BtnIconDel({ onClick, children }: BtnIconDelProps) {
  return (
    <button
      onClick={onClick}
      className='inline-flex items-center justify-center w-8.5 h-8.5 bg-transparent rounded-lg cursor-pointer transition-all duration-200 shrink-0 text-[#e05252] border border-[rgba(224,82,82,0.2)] hover:bg-[rgba(224,82,82,0.08)] hover:border-[#e05252]'
    >
      {children}
    </button>
  );
}

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}
function Modal({ children, onClose, maxWidth = "max-w-[580px]" }: ModalProps) {
  return (
    <div
      className='fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-1000 p-4 animate-fadeIn'
      onClick={onClose}
    >
      <div
        className={`bg-[#1a1916] border border-[rgba(201,168,76,0.3)] rounded-[18px] w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-slideUp`}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

interface ModalHeaderProps {
  title: string;
  titleStyle?: React.CSSProperties;
  onClose: () => void;
  extra?: React.ReactNode;
}
function ModalHeader({
  title,
  titleStyle = {},
  onClose,
  extra,
}: ModalHeaderProps) {
  return (
    <div className='flex items-center justify-between px-7 pt-6 pb-4 border-b border-[rgba(201,168,76,0.15)] sticky top-0 bg-[#1a1916] rounded-t-[18px] z-10'>
      <span
        className='font-cormorant text-2xl font-semibold italic text-[#C9A84C]'
        style={titleStyle}
      >
        {title}
      </span>
      <div className='flex gap-2'>
        {extra}
        <button
          onClick={onClose}
          className='flex items-center justify-center w-8 h-8 bg-transparent border border-[rgba(201,168,76,0.15)] rounded-lg text-[#8a8070] cursor-pointer transition-all duration-200 hover:bg-[#201f1c] hover:border-[rgba(201,168,76,0.3)] hover:text-[#f0ead8]'
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

interface ModalFooterProps {
  children: React.ReactNode;
}
function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className='flex gap-3 justify-end px-7 pt-4 pb-6 border-t border-[rgba(201,168,76,0.15)]'>
      {children}
    </div>
  );
}

export default function AnnouncementPage() {
  const [meta, setMeta] = useState<Meta>({
    count: 0,
    page: 1,
    page_size: 10,
    next: null,
    previous: null,
    total_pages: 1,
  });
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { data: announcementsData, isLoading } = useGetAnnouncementsQuery({});
  const announcements = announcementsData?.data || [];

  const [postAnnouncementMutation] = usePostAnnouncementMutation();
  const [deleteAnnouncementMutation] = useDeleteAnnouncementMutation();
  const [updateAnnouncementMutation] = useUpdateAnnouncementMutation();

  console.log({ announcements });

  const openView = (ann: Announcement): void => {
    setSelected(ann);
    setModal("view");
  };

  const openDelete = (ann: Announcement, e: React.MouseEvent): void => {
    e.stopPropagation();
    setSelected(ann);
    setModal("delete");
  };

  const closeModal = (): void => {
    setModal(null);
    setSelected(null);
  };

  const handleDelete = async (): Promise<void> => {
    setSubmitting(true);
    await new Promise<void>((r) => setTimeout(r, 600));

    setMeta((m) => ({ ...m, count: m.count - 1 }));
    setSubmitting(false);
    closeModal();
  };

  return (
    <>
      <style>{globalStyles}</style>

      <div className='container mx-auto font-dm bg-transparent text-[#f0ead8] min-h-screen p-8 px-6'>
        {/* ── Header ── */}
        <div className='flex items-end justify-between mb-10 gap-4 flex-wrap'>
          <div>
            <h1 className='font-cormorant text-[2.6rem] font-semibold italic text-[#C9A84C] tracking-[-0.01em] leading-none'>
              Announcements
            </h1>
            <p className='text-[0.8rem] text-[#8a8070] mt-1.5 tracking-[0.08em] uppercase'>
              Platform communications & notices
            </p>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        {!isLoading && (
          <div className='flex items-center gap-6 mb-7 px-5 py-3.5 bg-[#1a1916] border border-[rgba(201,168,76,0.15)] rounded-xl flex-wrap'>
            <div className='flex flex-col gap-[0.2rem]'>
              <span className='text-[0.65rem] text-[#8a8070] uppercase tracking-widest'>
                Total
              </span>
              <span className='font-cormorant text-[1.1rem] font-medium text-[#C9A84C]'>
                {meta.count}
              </span>
            </div>
            <div className='w-px h-7 bg-[rgba(201,168,76,0.15)]' />
            <div className='flex flex-col gap-[0.2rem]'>
              <span className='text-[0.65rem] text-[#8a8070] uppercase tracking-widest'>
                Page
              </span>
              <span className='font-cormorant text-[1.1rem] font-medium text-[#C9A84C]'>
                {meta.page} / {meta.total_pages}
              </span>
            </div>
            <div className='w-px h-7 bg-[rgba(201,168,76,0.15)]' />
            <div className='flex flex-col gap-[0.2rem]'>
              <span className='text-[0.65rem] text-[#8a8070] uppercase tracking-widest'>
                Showing
              </span>
              <span className='font-cormorant text-[1.1rem] font-medium text-[#C9A84C]'>
                {announcements.length}
              </span>
            </div>
          </div>
        )}

        {/* ── List ── */}
        {isLoading ? (
          <div className='grid grid-cols-1 gap-4'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='bg-[#1a1916] border border-[rgba(201,168,76,0.15)] rounded-[14px] p-6'
              >
                <div className='skeleton h-5 w-[55%] mb-2.5' />
                <div className='skeleton h-3 w-[30%] mb-3.5' />
                <div className='skeleton h-3 w-full mb-1.5' />
                <div className='skeleton h-3 w-4/5' />
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 px-8 text-center gap-4'>
            <EmptyIcon />
            <p className='font-cormorant text-[1.4rem] text-[#8a8070]'>
              No announcements yet
            </p>
            <p className='text-[0.82rem] text-[#8a8070] opacity-60'>
              Create your first announcement to get started
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4'>
            {announcements.map((ann: Announcement) => (
              <div
                key={ann.id}
                className='ann-card bg-[#1a1916] border border-[rgba(201,168,76,0.15)] rounded-[14px] px-6 py-[1.4rem] transition-all duration-200 cursor-pointer hover:border-[rgba(201,168,76,0.3)] hover:translate-x-0.75'
                onClick={() => openView(ann)}
              >
                {/* Card top */}
                <div className='flex items-start justify-between gap-4 mb-[0.7rem]'>
                  <h3 className='font-cormorant text-[1.25rem] font-semibold text-[#f0ead8] leading-[1.3]'>
                    {ann.title}
                  </h3>
                  {/* <div
                    className='flex gap-1.5 shrink-0'
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <BtnIconDel onClick={(e) => openDelete(ann, e)}>
                      <TrashIcon />
                    </BtnIconDel>
                  </div> */}
                </div>

                {/* Meta */}
                <div className='flex items-center gap-3 mb-3'>
                  <span className='inline-flex items-center gap-1 text-[0.68rem] text-[#8a8070] uppercase tracking-[0.06em]'>
                    <CalIcon />
                    {formatDate(ann.created_at)}
                  </span>
                  <span className='w-0.75 h-0.75 rounded-full bg-[rgba(201,168,76,0.3)]' />
                  <span className='text-[0.68rem] text-[#8a8070] uppercase tracking-[0.06em]'>
                    {timeAgo(ann.created_at)}
                  </span>
                </div>

                <p className='text-[0.875rem] text-[#8a8070] leading-[1.7] line-clamp-2'>
                  {ann.content}
                </p>

                {/* Footer */}
                <div className='flex items-center justify-between mt-4 pt-3 border-t border-[rgba(201,168,76,0.15)]'>
                  <button
                    className='font-dm text-[0.75rem] text-[#C9A84C] uppercase tracking-[0.06em] bg-none border-none cursor-pointer transition-colors duration-200 hover:text-[#E4C87A] p-0'
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      openView(ann);
                    }}
                  >
                    Read More →
                  </button>
                  <span className='text-[0.68rem] text-[#8a8070] opacity-50 tracking-[0.08em]'>
                    ID #{ann.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!isLoading && meta.total_pages > 1 && (
          <div className='flex items-center justify-center gap-2 mt-8'>
            <button
              disabled={!meta.previous}
              className='inline-flex items-center justify-center w-9 h-9 bg-[#1a1916] border border-[rgba(201,168,76,0.15)] rounded-lg text-[#8a8070] cursor-pointer transition-all duration-200 text-[0.8rem] disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:border-[#C9A84C] hover:enabled:text-[#C9A84C]'
            >
              <ChevronLeft />
            </button>
            {Array.from({ length: meta.total_pages }, (_, i) => (
              <button
                key={i + 1}
                className={`inline-flex items-center justify-center w-9 h-9 border rounded-lg text-[0.8rem] font-dm transition-all duration-200 cursor-pointer ${
                  meta.page === i + 1
                    ? "bg-[rgba(201,168,76,0.12)] border-[#C9A84C] text-[#C9A84C] font-medium"
                    : "bg-[#1a1916] border-[rgba(201,168,76,0.15)] text-[#8a8070] hover:border-[#C9A84C] hover:text-[#C9A84C]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={!meta.next}
              className='inline-flex items-center justify-center w-9 h-9 bg-[#1a1916] border border-[rgba(201,168,76,0.15)] rounded-lg text-[#8a8070] cursor-pointer transition-all duration-200 text-[0.8rem] disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:border-[#C9A84C] hover:enabled:text-[#C9A84C]'
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* ══════════ MODALS ══════════ */}

      {/* View */}
      {modal === "view" && selected && (
        <Modal onClose={closeModal}>
          <ModalHeader
            title='Announcement'
            titleStyle={{ fontSize: "1.2rem" }}
            onClose={closeModal}
          />
          <div className='px-7 py-6'>
            <div className='inline-flex items-center gap-1.5 text-[0.72rem] text-[#8a8070] uppercase tracking-[0.06em] px-3 py-[0.4rem] bg-[#201f1c] border border-[rgba(201,168,76,0.15)] rounded-full mb-5'>
              <CalIcon />
              {formatDate(selected.created_at)} · ID #{selected.id}
            </div>
            <h2 className='font-cormorant text-[1.7rem] font-semibold text-[#C9A84C] mb-4 leading-tight'>
              {selected.title}
            </h2>
            <p className='text-[0.925rem] text-[#f0ead8] leading-[1.8] opacity-90'>
              {selected.content}
            </p>
          </div>
          <ModalFooter>
            <BtnGhost onClick={closeModal}>Close</BtnGhost>
          </ModalFooter>
        </Modal>
      )}

      {/* Delete */}
      {modal === "delete" && selected && (
        <Modal onClose={closeModal} maxWidth='max-w-[460px]'>
          <ModalHeader
            title='Delete Announcement'
            titleStyle={{ color: "#e05252", fontSize: "1.2rem" }}
            onClose={closeModal}
          />
          <div className='px-7 py-6'>
            <div className='flex gap-4 items-start bg-[rgba(224,82,82,0.08)] border border-[rgba(224,82,82,0.2)] rounded-[10px] p-4 mb-5'>
              <WarnIcon />
              <p className='text-[0.85rem] text-[#f0ead8] leading-[1.6] opacity-85'>
                This action is permanent and cannot be undone. The announcement
                will be removed from the platform immediately.
              </p>
            </div>
            <p className='font-cormorant text-[1.1rem] font-semibold text-[#f0ead8] mb-3'>
              {selected.title}
            </p>
            <p className='text-[0.82rem] text-[#8a8070]'>
              Created {formatDate(selected.created_at)}
            </p>
          </div>
          <ModalFooter>
            <BtnGhost onClick={closeModal}>Cancel</BtnGhost>
            <BtnGold
              onClick={handleDelete}
              disabled={submitting}
              style={{ background: "#e05252", color: "#fff" }}
            >
              {submitting ? "Deleting..." : "Delete Permanently"}
            </BtnGold>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}
