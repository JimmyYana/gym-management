import { expect, test } from "@playwright/test";

test("planes del servicio simulado, normalización y navegación", async ({ page, request }) => {
  const response = await request.get("/api/planes/1");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toMatchObject({ nombre: "Standard", beneficios: ["Acceso libre", "Soporte"] });
  await page.goto("/");
  await expect(page).toHaveURL(/\/planes$/);
  await expect(page.getByRole("heading", { name: "Elige tu plan" })).toBeVisible();
  await expect(page.getByText("40$ por año")).toBeVisible();
  await expect(page.getByText("Acceso libre")).toBeVisible();
  await page.getByRole("link", { name: "Seleccionar Standard" }).click();
  await expect(page.getByLabel("Plan:")).toHaveValue("1");
  await page.getByRole("link", { name: "Regresar" }).click();
  await expect(page).toHaveURL(/\/miembros$/);
});

test("relación, búsqueda y filtros de miembros", async ({ page }) => {
  await page.goto("/miembros");
  await expect(page.getByText("Robert Fox")).toBeVisible();
  await expect(page.locator("article").filter({ hasText: "Robert Fox" })).toContainText("Standard");
  await expect(page.getByText("Plan no disponible")).toBeVisible();
  await page.getByLabel("Buscar por nombre o celular").fill("rose");
  await expect(page.locator(".member-card")).toHaveCount(1);
  await expect(page.getByText("Rose Bell")).toBeVisible();
  await page.getByLabel("Buscar por nombre o celular").clear();
  await page.getByLabel("Filtrar por plan").selectOption("1");
  await expect(page.locator(".member-card")).toHaveCount(1);
  await page.getByLabel("Filtrar por plan").selectOption("");
  await page.getByLabel("Filtrar por horario").selectOption("Mañana");
  await expect(page.locator(".member-card")).toHaveCount(2);
});

test("registro validado, edición y eliminación de un miembro en el mock", async ({ page, request }) => {
  await page.goto("/miembros");
  await page.getByRole("link", { name: "Agregar miembro" }).click();
  await expect(page.getByRole("heading", { name: "Agregar miembro" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Masculino" })).toBeChecked();
  await expect(page.getByRole("option", { name: "Efectivo" })).toHaveAttribute("value", "Cash");
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.locator(".member-form").getByRole("alert").first()).toBeVisible();
  await page.getByRole("textbox", { name: "Nombre:", exact: true }).fill("Miembro de prueba");
  await page.getByLabel("Celular:").fill("75512345");
  await page.getByLabel("N.º de miembro:").fill("1");
  await page.getByLabel("Plan:").selectOption("1");
  await page.getByLabel("Horario:").selectOption("Mañana");
  await page.getByLabel("Ingreso:").fill("2026-02-01");
  await page.getByLabel("Fecha de finalización").fill("2026-12-01");
  await page.getByLabel("Monto pagado:").fill("10");
  await expect(page.getByRole("status", { name: "Saldo pendiente:" })).toHaveText("30.00");
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText("El número de miembro ya está registrado.")).toBeVisible();
  await page.getByLabel("N.º de miembro:").fill("100");
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText("Miembro registrado.")).toBeVisible();
  const members = await (await request.get("/api/miembros")).json();
  expect(members.find((member: { numeroMiembro: string }) => member.numeroMiembro === "100")).toMatchObject({ montoPendiente: 30, planId: "1" });
  await page.getByRole("link", { name: "Editar a Miembro de prueba" }).click();
  await expect(page.getByRole("textbox", { name: "Nombre:", exact: true })).toHaveValue("Miembro de prueba");
  await page.getByRole("textbox", { name: "Nombre:", exact: true }).fill("Miembro actualizado");
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText("Cambios guardados.")).toBeVisible();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Eliminar a Miembro actualizado" }).click();
  await expect(page.getByText("Miembro actualizado")).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Eliminar a Miembro actualizado" }).click();
  await expect(page.getByText("Miembro eliminado.")).toBeVisible();
  await expect(page.getByText("Miembro actualizado")).toHaveCount(0);
});

test("CRUD de planes y protección de membresías asociadas", async ({ page, request }) => {
  const blocked = await request.delete("/api/planes/1");
  expect(blocked.status()).toBe(409);
  await page.goto("/planes/admin");
  await page.getByRole("button", { name: "Nuevo plan" }).click();
  await page.getByLabel("Nombre:").fill("Plan temporal");
  await page.getByLabel("Precio:").fill("80");
  await page.getByLabel("Beneficios:").fill("Primero\nSegundo");
  await page.getByRole("button", { name: "Guardar plan" }).click();
  await expect(page.getByText("Plan guardado.")).toBeVisible();
  const card = page.locator("article").filter({ hasText: "Plan temporal" });
  await card.getByRole("button", { name: "Editar" }).click();
  await page.getByLabel("Nombre:").fill("Plan actualizado");
  await page.getByRole("button", { name: "Guardar plan" }).click();
  const edited = page.locator("article").filter({ hasText: "Plan actualizado" });
  await expect(edited).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await edited.getByRole("button", { name: "Eliminar" }).click();
  await expect(page.getByText("Plan eliminado.")).toBeVisible();
  await expect(edited).toHaveCount(0);
});

test("errores HTTP, datos de API no cacheados y manifest standalone", async ({ request }) => {
  const invalid = await request.post("/api/miembros", { data: {} });
  expect(invalid.status()).toBe(400);
  expect((await request.get("/api/miembros/999")).status()).toBe(404);
  expect((await request.get("/api/miembros")).headers()["cache-control"]).toContain("no-store");
  expect(await (await request.get("/manifest.webmanifest")).json()).toMatchObject({ display: "standalone", start_url: "/planes" });
});

test("las tres pantallas se ajustan a 320 px, móvil y escritorio", async ({ page }, testInfo) => {
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 760 });
    for (const [route, selector] of [["/planes", ".plan-card"], ["/miembros", ".member-card"], ["/miembros/nuevo", ".member-form"]]) {
      await page.goto(route);
      await expect(page.locator(selector).first()).toBeVisible();
      const layout = await page.evaluate(() => ({
        insideViewport: document.documentElement.scrollWidth <= window.innerWidth,
        shellWidth: document.querySelector(".phone-shell")?.getBoundingClientRect().width ?? 0,
      }));
      expect(layout.insideViewport, `${route} @ ${width}`).toBe(true);
      expect(layout.shellWidth).toBeLessThanOrEqual(480);
      if (width === 390) {
        await page.screenshot({ path: testInfo.outputPath(`${route.slice(1).replaceAll("/", "-")}.png`), fullPage: true });
      }
    }
  }
});

test("estados de carga, error, reintento y vacío", async ({ page }) => {
  let fail = true;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/miembros", async (route) => {
    await gate;
    if (fail) {
      fail = false;
      await route.fulfill({ status: 503, json: { error: "No se pudo conectar con la API de miembros." } });
    } else {
      await route.fulfill({ status: 200, json: [] });
    }
  });

  await page.goto("/miembros", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Cargando…").first()).toBeVisible();
  release();
  await expect(page.getByText("No se pudo conectar con la API de miembros.")).toBeVisible();
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page.getByText("Aún no hay miembros.")).toBeVisible();
  await expect(page.locator("main").getByRole("link", { name: "Agregar miembro" })).toBeVisible();
});
