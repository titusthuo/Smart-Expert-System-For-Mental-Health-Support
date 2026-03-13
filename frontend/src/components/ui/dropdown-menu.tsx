import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";
import {
    Dimensions,
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type AnchorLayout = { x: number; y: number; width: number; height: number };

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: AnchorLayout | null;
  setAnchor: (layout: AnchorLayout | null) => void;
};

const DropdownMenuContext =
  React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu() {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx)
    throw new Error("DropdownMenu components must be used within DropdownMenu");
  return ctx;
}

type DropdownMenuProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function DropdownMenu({ children, open, onOpenChange }: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<AnchorLayout | null>(null);

  const isControlled = typeof open === "boolean";
  const actualOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      onOpenChange?.(next);
      if (!isControlled) setUncontrolledOpen(next);
      if (!next) setAnchor(null);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DropdownMenuContext.Provider
      value={{ open: actualOpen, setOpen, anchor, setAnchor }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
}

type DropdownMenuTriggerProps = {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof TouchableOpacity>, "children">;

function DropdownMenuTrigger({
  asChild = false,
  children,
  className,
  onPress,
  ...props
}: DropdownMenuTriggerProps) {
  const { setOpen, setAnchor } = useDropdownMenu();
  const anchorRef = React.useRef<View>(null);

  const handlePress = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  };

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<any>;
    return (
      <View ref={anchorRef} collapsable={false}>
        {React.cloneElement(child, {
          onPress: (e: any) => {
            onPress?.(e);
            child.props?.onPress?.(e);
            handlePress();
          },
          className: cn(child.props?.className, className),
          ...props,
        })}
      </View>
    );
  }

  return (
    <View ref={anchorRef} collapsable={false}>
      <TouchableOpacity
        onPress={(e) => {
          onPress?.(e);
          handlePress();
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
}

type DropdownMenuContentProps = {
  children: React.ReactNode;
  align?: "start" | "end";
  matchTriggerWidth?: boolean;
};

function DropdownMenuContent({
  children,
  align = "start",
  matchTriggerWidth = false,
}: DropdownMenuContentProps) {
  const { open, setOpen, anchor } = useDropdownMenu();

  if (!open) return null;

  const screen = Dimensions.get("window");
  const defaultWidth = 220;

  const width = matchTriggerWidth && anchor ? anchor.width : defaultWidth;

  const rawLeft =
    align === "end" && anchor
      ? anchor.x + anchor.width - width
      : anchor
        ? anchor.x
        : 16;

  const left = Math.max(12, Math.min(rawLeft, screen.width - width - 12));
  const top = anchor ? anchor.y + anchor.height + 8 : 80;

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        className="flex-1"
        onPress={() => setOpen(false)}
        style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ position: "absolute", top, left, width }}
        >
          <View
            className={cn(
              "bg-card border border-border rounded-xl p-2 shadow-lg",
            )}
          >
            {children}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type DropdownMenuItemProps = {
  children: React.ReactNode;
  onSelect?: () => void;
};

function DropdownMenuItem({ children, onSelect }: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenu();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        onSelect?.();
        setOpen(false);
      }}
      className={cn("flex-row items-center rounded-lg px-3 py-2")}
    >
      {typeof children === "string" ? (
        <Text className="text-sm text-foreground" numberOfLines={1}>
          {children}
        </Text>
      ) : (
        <View className="flex-row items-center flex-1">{children}</View>
      )}
    </TouchableOpacity>
  );
}

export {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
};

