from systems import PostgresMegaSystem


def main():
    
    systems = [
        PostgresMegaSystem(),
    ]
    
    for system in systems:
        system.run_cycle()
        
    print("Hello, Backup V2!")

    
if __name__ == "__main__":
    main()


