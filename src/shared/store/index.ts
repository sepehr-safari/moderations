import NDK, { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppState = {
  isLoginModalOpen: boolean;

  isZapModalOpen: boolean;

  zapTarget: NDKEvent | NDKUser | undefined;
};

type AppActions = {
  setIsLoginModalOpen: (isOpen: boolean) => void;

  setIsZapModalOpen: (isOpen: boolean) => void;

  setZapTarget: (target: NDKEvent | NDKUser | undefined) => void;
};

type GlobalNDKState = {
  globalNDK: NDK;
};

type GlobalNDKActions = {
  setGlobalNDK: (globalNDK: NDK) => void;
};

type ModerationState = {
  activeRelayUrl: string | undefined;
  activeGroupId: string | undefined;
  activeUserPub: string | undefined;
};

type ModerationActions = {
  setActiveRelayUrl: (activeRelayUrl: string | undefined) => void;
  setActiveGroupId: (activeGroupId: string | undefined) => void;
  setActiveUserPub: (activeUserPub: string | undefined) => void;
};

type RelaysState = {
  relays: string[];
  activeRelayUrl: string | undefined;
};

type RelaysActions = {
  addRelay: (relay: string) => void;
  safeRemoveRelay: (relay: string) => void;
  setActiveRelayUrl: (activeRelayUrl: string) => void;
};

export const useStore = create<
  AppState &
    AppActions &
    GlobalNDKState &
    GlobalNDKActions &
    ModerationState &
    ModerationActions &
    RelaysState &
    RelaysActions
>()(
  persist(
    (set, get) => ({
      // App State

      isLoginModalOpen: false,

      isZapModalOpen: false,

      zapTarget: undefined,

      setIsLoginModalOpen: (isOpen) => set({ isLoginModalOpen: isOpen }),

      setIsZapModalOpen: (isOpen) => set({ isZapModalOpen: isOpen }),

      setZapTarget: (target) => set({ zapTarget: target }),

      // Global NDK State

      globalNDK: new NDK({
        explicitRelayUrls: ['wss://nos.lol'],
        autoConnectUserRelays: false,
        autoFetchUserMutelist: false,
      }),

      setGlobalNDK: (globalNDK) => set({ globalNDK }),

      // moderation State

      activeGroupId: undefined,
      activeRelayUrl: undefined,
      activeUserPub: undefined,

      setActiveGroupId: (activeGroupId) => set({ activeGroupId }),
      setActiveRelayUrl: (activeRelayUrl) => set({ activeRelayUrl }),
      setActiveUserPub: (activeUserPub) => set({ activeUserPub }),

      // Relay State

      relays: ['wss://relay.groups.nip29.com', 'wss://groups.fiatjaf.com'],

      addRelay: (relay) => {
        const { relays } = get();

        if (!relays.includes(relay)) {
          set({ relays: [...relays, relay] });
        }
      },
      safeRemoveRelay: (relay) => {
        const { relays } = get();

        if (relays.length === 1) {
          return;
        }

        set({
          relays: relays.filter((r) => r !== relay),
        });
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        relays: [
          ...new Set(['wss://relay.groups.nip29.com', 'wss://groups.fiatjaf.com', ...state.relays]),
        ],
      }),
    },
  ),
);
