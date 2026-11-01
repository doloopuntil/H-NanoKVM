import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Divider } from 'antd';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';

// The pieces the menu bar popovers are built from, so that every entry looks the same: a header,
// rows that do something, and rows that pick one option out of a list. Rows pass their other
// props on, because Popconfirm and Tooltip need to put their handlers on the row they wrap.

// The title of a popover and the hairline under it. What sits on the right of the title (a
// button, a switch) is the children.
export const MenuHeader = ({ title, children }: { title: string; children?: ReactNode }) => (
  <>
    <div className="flex items-center justify-between px-1">
      <span className="text-base font-bold text-neutral-300">{title}</span>
      {children}
    </div>

    <Divider style={{ margin: '10px 0 15px 0' }} />
  </>
);

type MenuRowProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  // 18px wide
  icon: ReactNode;
  // an entry that is switched on shows in blue
  active?: boolean;
  // an entry that destroys something shows in red
  danger?: boolean;
  disabled?: boolean;
  children: ReactNode;
};

// A row that does something, or opens something: a 16px icon in an 18px box and a label, 30px tall.
export const MenuRow = forwardRef<HTMLDivElement, MenuRowProps>(
  ({ icon, active, danger, disabled, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'flex min-h-[30px] items-center rounded-sm px-3 py-1 text-sm select-none',
        disabled
          ? 'cursor-not-allowed text-neutral-500'
          : [
              'cursor-pointer hover:bg-neutral-700/70',
              danger ? 'text-red-500' : active ? 'text-blue-400' : 'text-neutral-300'
            ],
        className
      )}
      {...props}
    >
      <div className="mr-2 flex size-[18px] shrink-0 items-center justify-center">{icon}</div>
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  )
);
MenuRow.displayName = 'MenuRow';

type MenuOptionProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  selected?: boolean;
  disabled?: boolean;
  // a small picture before the label, such as the shape of a cursor
  icon?: ReactNode;
  children: ReactNode;
};

// A row that picks one option out of a list: a blue check in front of the one that is chosen.
export const MenuOption = forwardRef<HTMLDivElement, MenuOptionProps>(
  ({ selected, disabled, icon, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'flex min-h-[30px] items-center rounded-sm py-1 pr-5 pl-1 text-sm select-none',
        disabled
          ? 'cursor-not-allowed text-neutral-500'
          : 'cursor-pointer text-neutral-300 hover:bg-neutral-700/70',
        className
      )}
      {...props}
    >
      <div className="flex h-[14px] w-[20px] shrink-0 items-end text-blue-500">
        {selected && <CheckIcon size={16} />}
      </div>
      {icon && <div className="mr-1.5 flex shrink-0 items-center justify-center">{icon}</div>}
      <div className="flex items-center">{children}</div>
    </div>
  )
);
MenuOption.displayName = 'MenuOption';
