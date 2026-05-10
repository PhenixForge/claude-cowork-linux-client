#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Child, Command};
use std::sync::Mutex;
use tauri::Manager;

struct BackendProcess(Mutex<Option<Child>>);

impl Drop for BackendProcess {
    fn drop(&mut self) {
        if let Ok(mut guard) = self.0.lock() {
            if let Some(mut child) = guard.take() {
                let _ = child.kill();
            }
        }
    }
}

fn spawn_backend() -> Option<Child> {
    let cwd = std::env::current_dir().ok()?;
    let candidates = [cwd.join("backend"), cwd.join("../backend")];
    for dir in &candidates {
        if dir.join("main.py").exists() {
            return Command::new("python3")
                .arg("main.py")
                .current_dir(dir)
                .spawn()
                .ok();
        }
    }
    None
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            app.manage(BackendProcess(Mutex::new(spawn_backend())));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
