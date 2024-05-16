<script lang="ts">
	import '$lib/styles/global.css';
	import {
		AppBar,
		AppShell,
		Avatar,
		Drawer,
		LightSwitch,
		Modal,
		Toast,
		getDrawerStore,
		initializeStores
	} from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/navigation.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { Menu } from 'lucide-svelte';

	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import convertNameToInitials from '$lib/util/name-util';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	export let data;

	initializeStores();
	const drawerStore = getDrawerStore();

	function drawerOpen(): void {
		drawerStore.open();
	}

	let initials = '';
	onMount(() => {
		if (data?.user?.firstName && data?.user?.lastName) {
			initials = convertNameToInitials(data?.user?.firstName, data?.user?.lastName);
		}
	});
	$: initials = initials;
</script>

<Toast position="tr" />
<Modal />
<Drawer>
	<Navigation user={data.user} />
</Drawer>

<AppShell slotSidebarLeft="w-0 md:w-52 bg-surface-500/10">
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<button class="md:hidden btn btn-sm mr-4" aria-label="Menu Button" on:click={drawerOpen}>
					<span>
						<Menu />
					</span>
				</button>
				<strong class="text-xl uppercase">Project Status Tracker</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if data?.user}<Avatar {initials} width="w-10" background="bg-primary-500" />{/if}
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Navigation user={data.user} />
	</svelte:fragment>
	<div class="container lg:p-10 mx-auto">
		<slot />
	</div>
	<svelte:fragment slot="pageFooter"><Footer /></svelte:fragment>
</AppShell>
