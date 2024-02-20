import { create, type StateCreator } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

type UUID = string

export type Base = {
  id: UUID

  created: number
  deleted?: number
  updated?: number

  name: string
  owner: string
  version: string
}

export type DisplayBase = Base & {
  cover?: string
  description?: string
  gameVersion?: string
  tags?: string[]
}

export type Mod = DisplayBase & {
  conflicts?: UUID[]
  dependencies?: UUID[]
  instructions?: string
  recommended?: boolean
}

export type Profile = DisplayBase & {
  disabledMods?: UUID[]
  enabledMods: UUID[]
  instructions?: string

  order: number
  visible: boolean
}

export interface ModStore {
  mods: Mod[]

  addMod: (mod: Partial<Mod>) => void
  deleteMod: (id: UUID) => void
  updateMod: (id: UUID, mod: Partial<Mod>) => void
}

export interface ProfileStore {
  profiles: Profile[]

  addProfile: (profile: Partial<Profile>) => void
  deleteProfile: (id: UUID) => void
  reorderProfile: (sourceIndex: number, targetIndex: number) => void
  updateProfile: (id: UUID, profile: Partial<Profile>) => void
}

const createModSlice: StateCreator<
  ModStore & ProfileStore,
  [],
  [],
  ModStore
> = (set, get) => ({
  mods: [],

  addMod: mod => {
    const state = get()

    // check the UUID doesn't already exist (if so, replace it)
    const existingMod = state.mods.find(x => x.id === mod.id)
    if (existingMod) {
      mod = {
        ...existingMod,
        ...mod,
        updated: new Date().getTime(),
      }
    }

    set({
      mods: [
        ...state.mods.filter(x => x.id !== mod.id),
        {
          ...mod,
          id: mod.id ?? uuidv4(),
          created: mod.created ?? new Date().getTime(),
          name: mod.name ?? 'Untitled Mod',
          owner: mod.owner ?? 'local',
          version: mod.version ?? '0.1.0',
        },
      ],
    })
  },

  deleteMod: id => {
    const mods = get().mods

    set({
      mods: mods.filter(x => x.id !== id),
    })
  },

  updateMod: (id, mod) => {
    const mods = get().mods

    mod.id = id

    const newMod = {
      ...mods.find(x => x.id === id),
      ...mod,
      updated: new Date().getTime(),
    } as Mod

    set({
      mods: mods.map(x => (x.id === id ? newMod : x)),
    })
  },
})

const createProfileSlice: StateCreator<
  ModStore & ProfileStore,
  [],
  [],
  ProfileStore
> = (set, get) => ({
  profiles: [],

  addProfile: profile => {
    const state = get()

    set({
      profiles: [
        ...state.profiles,
        {
          ...profile,
          id: profile.id ?? uuidv4(),
          created: profile.created ?? new Date().getTime(),
          enabledMods: profile.enabledMods ?? [],
          name: profile.name ?? 'Untitled Profile',
          order: profile.order ?? state.profiles.length + 1,
          owner: profile.owner ?? 'local',
          version: profile.version ?? '0.1.0',
          visible: profile.visible ?? true,
        },
      ],
    })
  },

  deleteProfile: id => {
    const profiles = get().profiles

    set({
      profiles: profiles.filter(x => x.id !== id),
    })
  },

  reorderProfile: (sourceIndex, targetIndex) =>
    set(state => {
      const newProfiles = [...state.profiles]
      const [removed] = newProfiles.splice(sourceIndex, 1)
      newProfiles.splice(targetIndex, 0, removed)

      // update order
      newProfiles.forEach((x, i) => {
        x.order = i + 1
      })

      return {
        ...state,
        profiles: newProfiles,
      }
    }, true),

  updateProfile: (id, profile) => {
    const profiles = get().profiles

    profile.id = id

    const newProfile = {
      ...profiles.find(x => x.id === id),
      ...profile,
      updated: new Date().getTime(),
    } as Profile

    set({
      profiles: profiles.map(x => (x.id === id ? newProfile : x)),
    })
  },
})

export const useStore = create<ModStore & ProfileStore>((...a) => ({
  ...createModSlice(...a),
  ...createProfileSlice(...a),
}))
