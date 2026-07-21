/**
 * Runtime Isolation Verification Test
 * 
 * This test creates two provisioned workspaces (A and B), modifies every
 * configurable entity independently, then verifies that changes to A never
 * affect B and vice versa.
 * 
 * This is a REAL runtime test, not just static code analysis.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createSupabaseAdminProviders } from "@/lib/providers/supabase/index";
import { createRepositories } from "@/lib/repositories/factory";
import { WorkspaceRepository } from "@/lib/core/workspace/repository";
import type { WorkspaceEntity } from "@/lib/core/workspace/types";

describe("Runtime Workspace Isolation Verification", () => {
  let workspaceA: WorkspaceEntity;
  let workspaceB: WorkspaceEntity;
  let reposA: ReturnType<typeof createRepositories>;
  let reposB: ReturnType<typeof createRepositories>;
  let workspaceRepo: WorkspaceRepository;

  beforeAll(async () => {
    console.log("🔍 Starting Runtime Isolation Verification Test");
    console.log("==============================================");
    
    // Initialize providers and repositories
    const providers = createSupabaseAdminProviders();
    const baseDeps = {
      database: providers.database,
      storage: providers.storage,
      auth: providers.auth,
      realtime: providers.realtime,
    };
    
    workspaceRepo = new WorkspaceRepository(baseDeps);
    
    // Create two isolated workspaces using getOrCreateDefault
    console.log("1️⃣ Creating test workspaces...");
    workspaceA = await workspaceRepo.getOrCreateDefault("test-user-a");
    workspaceB = await workspaceRepo.getOrCreateDefault("test-user-b");
    
    // Update the workspaces to have distinct domains for testing
    workspaceA = {
      ...workspaceA,
      metadata: {
        ...workspaceA.metadata,
        name: "Runtime Test Workspace A",
        description: "Isolation test workspace A",
        domain: "runtime-test-a.example.com",
      },
    };
    
    workspaceB = {
      ...workspaceB,
      metadata: {
        ...workspaceB.metadata,
        name: "Runtime Test Workspace B",
        description: "Isolation test workspace B",
        domain: "runtime-test-b.example.com",
      },
    };
    
    // Save the updated workspaces
    await workspaceRepo.save(workspaceA);
    await workspaceRepo.save(workspaceB);
    
    console.log(`✅ Workspace A created: ${workspaceA.id} (${workspaceA.metadata.domain})`);
    console.log(`✅ Workspace B created: ${workspaceB.id} (${workspaceB.metadata.domain})`);
    
    // Create repositories for each workspace
    reposA = createRepositories({
      ...baseDeps,
      workspace: { workspaceId: workspaceA.id, entity: workspaceA },
    });
    
    reposB = createRepositories({
      ...baseDeps,
      workspace: { workspaceId: workspaceB.id, entity: workspaceB },
    });
  });

  afterAll(async () => {
    // Cleanup
    console.log("\n🧹 Cleaning up test workspaces...");
    try {
      await workspaceRepo.delete(workspaceA.id);
      await workspaceRepo.delete(workspaceB.id);
      console.log("✅ Test workspaces cleaned up");
    } catch (error) {
      console.warn("⚠️ Could not clean up test workspaces:", error);
    }
  });

  it("Theme settings are completely isolated between workspaces", async () => {
    console.log("\n2️⃣ Testing Theme Isolation...");
    
    // Set different themes for each workspace
    await reposA.theme.upsertThemeSettings({
      primary_color: "#FF5733",
      secondary_color: "#33FF57",
      accent_color: "#3357FF",
      font_family: "Arial, sans-serif",
      workspace_specific_setting: "Workspace A Theme",
    });
    
    await reposB.theme.upsertThemeSettings({
      primary_color: "#8A2BE2",
      secondary_color: "#FF6347",
      accent_color: "#7FFF00",
      font_family: "Verdana, sans-serif",
      workspace_specific_setting: "Workspace B Theme",
    });
    
    // Verify isolation
    const themeA = await reposA.theme.getThemeSettings();
    const themeB = await reposB.theme.getThemeSettings();
    
    console.log(`🎨 Workspace A theme: ${themeA.workspace_specific_setting}`);
    console.log(`🎨 Workspace B theme: ${themeB.workspace_specific_setting}`);
    
    expect(themeA.workspace_specific_setting).toBe("Workspace A Theme");
    expect(themeB.workspace_specific_setting).toBe("Workspace B Theme");
    expect(themeA.workspace_specific_setting).not.toBe(themeB.workspace_specific_setting);
    
    console.log("✅ Theme isolation: PASS");
  });

  it("Menu items are completely isolated between workspaces", async () => {
    console.log("\n3️⃣ Testing Menu Isolation...");
    
    // Create workspace-specific menu items
    const menuItemA = {
      category: "Drinks",
      name: "Runtime Test Workspace A Special Coffee",
      description: "Exclusive to Workspace A",
      price: "5.99",
      imageUrl: "https://example.com/coffee-a.jpg",
      sortOrder: 1,
      visible: true,
    };
    
    const menuItemB = {
      category: "Drinks",
      name: "Runtime Test Workspace B Special Tea",
      description: "Exclusive to Workspace B",
      price: "4.99",
      imageUrl: "https://example.com/tea-b.jpg",
      sortOrder: 1,
      visible: true,
    };
    
    await reposA.menu.upsertMenuItem(menuItemA);
    await reposB.menu.upsertMenuItem(menuItemB);
    
    // Verify isolation
    const menuA = await reposA.menu.getMenuItems();
    const menuB = await reposB.menu.getMenuItems();
    
    const hasWorkspaceASpecial = menuA.some(item => item.name.includes("Runtime Test Workspace A"));
    const hasWorkspaceBSpecial = menuB.some(item => item.name.includes("Runtime Test Workspace B"));
    const noCrossContamination = 
      !menuA.some(item => item.name.includes("Runtime Test Workspace B")) && 
      !menuB.some(item => item.name.includes("Runtime Test Workspace A"));
    
    console.log(`🍽️ Workspace A has its special item: ${hasWorkspaceASpecial}`);
    console.log(`🍽️ Workspace B has its special item: ${hasWorkspaceBSpecial}`);
    console.log(`🔒 No cross-contamination: ${noCrossContamination}`);
    
    expect(hasWorkspaceASpecial).toBe(true);
    expect(hasWorkspaceBSpecial).toBe(true);
    expect(noCrossContamination).toBe(true);
    
    console.log("✅ Menu isolation: PASS");
  });

  it("Gallery images are completely isolated between workspaces", async () => {
    console.log("\n4️⃣ Testing Gallery Isolation...");
    
    // Create workspace-specific gallery images
    const galleryImageA = {
      url: "https://example.com/gallery-a.jpg",
      altText: "Runtime Test Workspace A Gallery Image",
      caption: "Beautiful view from Workspace A",
      sortOrder: 1,
      visible: true,
    };
    
    const galleryImageB = {
      url: "https://example.com/gallery-b.jpg",
      altText: "Runtime Test Workspace B Gallery Image",
      caption: "Beautiful view from Workspace B",
      sortOrder: 1,
      visible: true,
    };
    
    await reposA.gallery.upsertGalleryImage(galleryImageA);
    await reposB.gallery.upsertGalleryImage(galleryImageB);
    
    // Verify isolation
    const galleryA = await reposA.gallery.getGalleryImages();
    const galleryB = await reposB.gallery.getGalleryImages();
    
    const hasWorkspaceAGallery = galleryA.some(img => img.altText.includes("Runtime Test Workspace A"));
    const hasWorkspaceBGallery = galleryB.some(img => img.altText.includes("Runtime Test Workspace B"));
    const noGalleryCrossContamination = 
      !galleryA.some(img => img.altText.includes("Runtime Test Workspace B")) && 
      !galleryB.some(img => img.altText.includes("Runtime Test Workspace A"));
    
    console.log(`🖼️ Workspace A has its gallery image: ${hasWorkspaceAGallery}`);
    console.log(`🖼️ Workspace B has its gallery image: ${hasWorkspaceBGallery}`);
    console.log(`🔒 No gallery cross-contamination: ${noGalleryCrossContamination}`);
    
    expect(hasWorkspaceAGallery).toBe(true);
    expect(hasWorkspaceBGallery).toBe(true);
    expect(noGalleryCrossContamination).toBe(true);
    
    console.log("✅ Gallery isolation: PASS");
  });

  it("Site content is completely isolated between workspaces", async () => {
    console.log("\n5️⃣ Testing Site Content Isolation...");
    
    // Create workspace-specific site content
    await reposA.siteContent.upsertSiteContent({
      key: "hero_title",
      value: "Welcome to Runtime Test Workspace A!",
      type: "text",
    });
    
    await reposB.siteContent.upsertSiteContent({
      key: "hero_title",
      value: "Welcome to Runtime Test Workspace B!",
      type: "text",
    });
    
    // Verify isolation
    const contentA = await reposA.siteContent.getSiteContent();
    const contentB = await reposB.siteContent.getSiteContent();
    
    const heroTitleA = contentA.find(c => c.key === "hero_title")?.value;
    const heroTitleB = contentB.find(c => c.key === "hero_title")?.value;
    
    console.log(`📝 Workspace A hero title: "${heroTitleA}"`);
    console.log(`📝 Workspace B hero title: "${heroTitleB}"`);
    
    expect(heroTitleA).toBe("Welcome to Runtime Test Workspace A!");
    expect(heroTitleB).toBe("Welcome to Runtime Test Workspace B!");
    expect(heroTitleA).not.toBe(heroTitleB);
    
    console.log("✅ Site content isolation: PASS");
  });

  it("Events are completely isolated between workspaces", async () => {
    console.log("\n6️⃣ Testing Events Isolation...");
    
    // Create workspace-specific events
    const eventA = {
      title: "Runtime Test Workspace A Grand Opening",
      description: "Join us for the grand opening of Workspace A!",
      date: "2024-12-01",
      time: "10:00",
      location: "Workspace A Location",
    };
    
    const eventB = {
      title: "Runtime Test Workspace B Grand Opening",
      description: "Join us for the grand opening of Workspace B!",
      date: "2024-12-02",
      time: "11:00",
      location: "Workspace B Location",
    };
    
    await reposA.events.upsertEvent(eventA);
    await reposB.events.upsertEvent(eventB);
    
    // Verify isolation
    const eventsA = await reposA.events.getEvents();
    const eventsB = await reposB.events.getEvents();
    
    const hasWorkspaceAEvent = eventsA.some(e => e.title.includes("Runtime Test Workspace A"));
    const hasWorkspaceBEvent = eventsB.some(e => e.title.includes("Runtime Test Workspace B"));
    const noEventsCrossContamination = 
      !eventsA.some(e => e.title.includes("Runtime Test Workspace B")) && 
      !eventsB.some(e => e.title.includes("Runtime Test Workspace A"));
    
    console.log(`🎉 Workspace A has its event: ${hasWorkspaceAEvent}`);
    console.log(`🎉 Workspace B has its event: ${hasWorkspaceBEvent}`);
    console.log(`🔒 No events cross-contamination: ${noEventsCrossContamination}`);
    
    expect(hasWorkspaceAEvent).toBe(true);
    expect(hasWorkspaceBEvent).toBe(true);
    expect(noEventsCrossContamination).toBe(true);
    
    console.log("✅ Events isolation: PASS");
  });

  it("Final cross-contamination verification - no workspace can see other workspace's data", async () => {
    console.log("\n7️⃣ Final Cross-Contamination Verification...");
    
    // Get all data from both workspaces
    const allMenuA = await reposA.menu.getMenuItems();
    const allGalleryA = await reposA.gallery.getGalleryImages();
    const allEventsA = await reposA.events.getEvents();
    
    const allMenuB = await reposB.menu.getMenuItems();
    const allGalleryB = await reposB.gallery.getGalleryImages();
    const allEventsB = await reposB.events.getEvents();
    
    // Verify Workspace A can only see its own data
    const workspaceASeesOnlyItsData = 
      !allMenuA.some(item => item.name.includes("Runtime Test Workspace B")) &&
      !allGalleryA.some(img => img.altText.includes("Runtime Test Workspace B")) &&
      !allEventsA.some(e => e.title.includes("Runtime Test Workspace B"));
    
    // Verify Workspace B can only see its own data
    const workspaceBSeesOnlyItsData = 
      !allMenuB.some(item => item.name.includes("Runtime Test Workspace A")) &&
      !allGalleryB.some(img => img.altText.includes("Runtime Test Workspace A")) &&
      !allEventsB.some(e => e.title.includes("Runtime Test Workspace A"));
    
    console.log(`🔍 Workspace A sees only its data: ${workspaceASeesOnlyItsData}`);
    console.log(`🔍 Workspace B sees only its data: ${workspaceBSeesOnlyItsData}`);
    
    const completeIsolation = workspaceASeesOnlyItsData && workspaceBSeesOnlyItsData;
    
    expect(workspaceASeesOnlyItsData).toBe(true);
    expect(workspaceBSeesOnlyItsData).toBe(true);
    expect(completeIsolation).toBe(true);
    
    console.log("\n" + "=".repeat(50));
    console.log("🎯 FINAL RESULT: ✅ PASS - COMPLETE ISOLATION VERIFIED");
    console.log("=".repeat(50));
  });
});